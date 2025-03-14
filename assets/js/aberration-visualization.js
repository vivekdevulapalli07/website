// Aberration Visualization JavaScript
// This script implements the interactive aberration visualization tool

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing aberration visualization');
  
  // Initialize tabs first
  initTabs();
  
  // Then initialize the visualizations
  setTimeout(function() {
    initVisualizations();
  }, 100);
});

// Initialize tab functionality
function initTabs() {
  console.log('Initializing tabs');
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  console.log('Found tab buttons:', tabButtons.length);
  console.log('Found tab panes:', tabPanes.length);
  
  if (tabButtons.length === 0 || tabPanes.length === 0) {
    console.error('Tab elements not found!');
    return;
  }
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons and panes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      // Add active class to clicked button and corresponding pane
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      const targetPane = document.getElementById(`${tabId}-tab`);
      
      if (targetPane) {
        targetPane.classList.add('active');
        console.log(`Activated tab: ${tabId}`);
      } else {
        console.error(`Tab pane with id ${tabId}-tab not found!`);
      }
    });
  });
}

// Initialize all visualizations
function initVisualizations() {
  console.log('Initializing visualizations');
  
  // Check if Three.js is available
  if (typeof THREE === 'undefined') {
    console.log('Three.js not found, loading dynamically');
    loadThreeJS().then(() => {
      console.log('Three.js loaded');
      initWavefrontVisualizations();
      initPSFVisualizations();
    }).catch(error => {
      console.error('Failed to load Three.js:', error);
      displayErrorMessage();
    });
  } else {
    console.log('Three.js already available');
    initWavefrontVisualizations();
    initPSFVisualizations();
  }
  
  // Initialize sliders and controls
  initControlListeners();
}

// Function to load Three.js dynamically
function loadThreeJS() {
  return new Promise((resolve, reject) => {
    const threeScript = document.createElement('script');
    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    threeScript.onload = () => {
      // After Three.js is loaded, load OrbitControls
      const orbitScript = document.createElement('script');
      orbitScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
      orbitScript.onload = () => resolve();
      orbitScript.onerror = () => reject(new Error('Failed to load OrbitControls'));
      document.head.appendChild(orbitScript);
    };
    threeScript.onerror = () => reject(new Error('Failed to load Three.js'));
    document.head.appendChild(threeScript);
  });
}

// Display error message if Three.js fails to load
function displayErrorMessage() {
  const canvases = [
    document.getElementById('wavefront-3d'),
    document.getElementById('wavefront-2d'),
    document.getElementById('psf-canvas'),
    document.getElementById('psf-3d')
  ];
  
  canvases.forEach(canvas => {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f8d7da';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '14px Arial';
        ctx.fillStyle = '#721c24';
        ctx.textAlign = 'center';
        ctx.fillText('Error: Three.js could not be loaded', canvas.width/2, canvas.height/2);
        ctx.fillText('Please check your internet connection', canvas.width/2, canvas.height/2 + 20);
      }
    }
  });
}

// Global variables
let wavefront3D = {
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  mesh: null,
  animationId: null
};

let wavefront2D = {
  canvas: null,
  ctx: null
};

let psf = {
  canvas: null,
  ctx: null
};

let psf3D = {
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  mesh: null,
  animationId: null
};

let compareCanvases = {
  astig2: null,
  astig3: null,
  coma: null,
  spherical: null
};

// Default settings
let currentAberration = 'astigmatism-2fold';
let currentAmplitude = 0.5;
let currentRotation = 0;
let resolution = 40;
let zoom = 100;
let animationSpeed = 50;

// Initialize control listeners
function initControlListeners() {
  console.log('Setting up control listeners');
  
  // Aberration type selectors
  const aberrationButtons = document.querySelectorAll('.aberration-button');
  aberrationButtons.forEach(button => {
    button.addEventListener('click', function() {
      const parentSelector = this.closest('.aberration-selector');
      if (parentSelector) {
        parentSelector.querySelectorAll('.aberration-button').forEach(btn => {
          btn.classList.remove('active');
        });
        
        this.classList.add('active');
        currentAberration = this.getAttribute('data-type');
        updateVisualizations();
        
        // Show/hide rotation slider based on aberration type
        const rotationContainer = document.getElementById('rotation-container');
        if (rotationContainer) {
          rotationContainer.style.display = currentAberration === 'spherical' ? 'none' : 'flex';
        }
      }
    });
  });
  
  // Amplitude slider
  const amplitudeSlider = document.getElementById('amplitude-slider');
  const amplitudeValue = document.getElementById('amplitude-value');
  
  if (amplitudeSlider && amplitudeValue) {
    amplitudeSlider.addEventListener('input', function() {
      currentAmplitude = this.value / 100;
      amplitudeValue.textContent = currentAmplitude.toFixed(1);
      updateVisualizations();
    });
  }
  
  // Rotation slider
  const rotationSlider = document.getElementById('rotation-slider');
  const rotationValue = document.getElementById('rotation-value');
  
  if (rotationSlider && rotationValue) {
    rotationSlider.addEventListener('input', function() {
      currentRotation = parseInt(this.value);
      rotationValue.textContent = currentRotation + '°';
      updateVisualizations();
    });
  }
  
  // Resolution slider
  const resolutionSlider = document.getElementById('resolution-slider');
  const resolutionValue = document.getElementById('resolution-value');
  
  if (resolutionSlider && resolutionValue) {
    resolutionSlider.addEventListener('input', function() {
      resolution = parseInt(this.value);
      resolutionValue.textContent = resolution;
      createWavefront3DMesh();
    });
  }
}

// Initialize wavefront visualizations
function initWavefrontVisualizations() {
  console.log('Initializing wavefront visualizations');
  
  // Initialize 3D wavefront
  const canvas3D = document.getElementById('wavefront-3d');
  if (!canvas3D) {
    console.error('Could not find wavefront-3d canvas');
    return;
  }
  
  // Ensure canvas has proper dimensions
  ensureCanvasDimensions(canvas3D);
  
  const width = canvas3D.clientWidth;
  const height = canvas3D.clientHeight;
  console.log(`Canvas dimensions: ${width}x${height}`);
  
  // Create Three.js scene
  wavefront3D.scene = new THREE.Scene();
  wavefront3D.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  wavefront3D.renderer = new THREE.WebGLRenderer({ 
    canvas: canvas3D, 
    antialias: true 
  });
  wavefront3D.renderer.setSize(width, height);
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  wavefront3D.scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  wavefront3D.scene.add(directionalLight);
  
  // Add orbit controls
  wavefront3D.controls = new THREE.OrbitControls(wavefront3D.camera, wavefront3D.renderer.domElement);
  
  // Position camera
  wavefront3D.camera.position.z = 5;
  
  // Create mesh
  createWavefront3DMesh();
  
  // Start animation loop
  animate3D();
  
  // Initialize 2D wavefront
  wavefront2D.canvas = document.getElementById('wavefront-2d');
  if (wavefront2D.canvas) {
    ensureCanvasDimensions(wavefront2D.canvas);
    wavefront2D.ctx = wavefront2D.canvas.getContext('2d');
    updateWavefront2D();
  }
}

// Initialize PSF visualizations
function initPSFVisualizations() {
  console.log('Initializing PSF visualizations');
  
  // Setup PSF 2D canvas
  psf.canvas = document.getElementById('psf-canvas');
  if (psf.canvas) {
    ensureCanvasDimensions(psf.canvas);
    psf.ctx = psf.canvas.getContext('2d');
    updatePSF();
  }
  
  // Setup PSF 3D canvas
  const psf3DCanvas = document.getElementById('psf-3d');
  if (psf3DCanvas) {
    ensureCanvasDimensions(psf3DCanvas);
    
    const width = psf3DCanvas.clientWidth;
    const height = psf3DCanvas.clientHeight;
    
    psf3D.scene = new THREE.Scene();
    psf3D.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    psf3D.renderer = new THREE.WebGLRenderer({ 
      canvas: psf3DCanvas, 
      antialias: true 
    });
    psf3D.renderer.setSize(width, height);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    psf3D.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    psf3D.scene.add(directionalLight);
    
    // Add orbit controls
    psf3D.controls = new THREE.OrbitControls(psf3D.camera, psf3D.renderer.domElement);
    
    // Position camera
    psf3D.camera.position.z = 5;
    
    // Create mesh and start animation
    createPSF3DMesh();
    animatePSF3D();
  }
}

// Ensure canvas has proper dimensions
function ensureCanvasDimensions(canvas) {
  if (!canvas) return;
  
  // Make sure canvas has explicit width and height
  if (canvas.width === 0 || canvas.height === 0) {
    const displayWidth = canvas.clientWidth || 300;
    const displayHeight = canvas.clientHeight || 300;
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    console.log(`Set canvas dimensions to ${displayWidth}x${displayHeight}`);
  }
}

// Create 3D wavefront mesh
function createWavefront3DMesh() {
  if (!wavefront3D.scene) {
    console.error('wavefront3D.scene is not initialized');
    return;
  }
  
  // Remove existing mesh if any
  if (wavefront3D.mesh) {
    wavefront3D.scene.remove(wavefront3D.mesh);
    wavefront3D.mesh.geometry.dispose();
    wavefront3D.mesh.material.dispose();
  }
  
  // Create geometry for the wavefront
  const geometry = new THREE.PlaneGeometry(4, 4, resolution - 1, resolution - 1);
  
  // Apply aberration to vertices
  const vertices = geometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    
    // Convert to polar coordinates
    const r = Math.sqrt(x * x + y * y);
    let theta = Math.atan2(y, x);
    
    // Apply aberration
    let z = 0;
    
    switch (currentAberration) {
      case 'astigmatism-2fold':
        z = currentAmplitude * r * r * Math.cos(2 * (theta - currentRotation * Math.PI / 180));
        break;
      case 'astigmatism-3fold':
        z = currentAmplitude * r * r * r * Math.cos(3 * (theta - currentRotation * Math.PI / 180));
        break;
      case 'coma':
        z = currentAmplitude * r * r * r * Math.cos(theta - currentRotation * Math.PI / 180);
        break;
      case 'spherical':
        z = currentAmplitude * Math.pow(r, 4);
        break;
    }
    
    vertices[i + 2] = z;
  }
  
  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
  
  // Create material
  const material = new THREE.MeshPhongMaterial({
    color: 0x0088ff,
    side: THREE.DoubleSide,
    wireframe: false,
    transparent: true,
    opacity: 0.8,
    shininess: 80
  });
  
  // Create mesh
  wavefront3D.mesh = new THREE.Mesh(geometry, material);
  wavefront3D.scene.add(wavefront3D.mesh);
  
  // Add wireframe
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
    transparent: true,
    opacity: 0.1
  });
  
  const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
  wavefront3D.mesh.add(wireframe);
}

// Create 3D PSF mesh (simplified)
function createPSF3DMesh() {
  if (!psf3D.scene) return;
  
  // Remove existing mesh if any
  if (psf3D.mesh) {
    psf3D.scene.remove(psf3D.mesh);
    psf3D.mesh.geometry.dispose();
    psf3D.mesh.material.dispose();
  }
  
  // Create geometry for the PSF
  const geometry = new THREE.PlaneGeometry(4, 4, resolution - 1, resolution - 1);
  
  // Apply PSF intensity to geometry
  const vertices = geometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    
    // Convert to polar coordinates
    const r = Math.sqrt(x * x + y * y);
    let theta = Math.atan2(y, x);
    
    // Calculate phase based on aberration
    let phase = 0;
    
    switch (currentAberration) {
      case 'astigmatism-2fold':
        phase = currentAmplitude * r * r * Math.cos(2 * (theta - currentRotation * Math.PI / 180));
        break;
      case 'astigmatism-3fold':
        phase = currentAmplitude * r * r * r * Math.cos(3 * (theta - currentRotation * Math.PI / 180));
        break;
      case 'coma':
        phase = currentAmplitude * r * r * r * Math.cos(theta - currentRotation * Math.PI / 180);
        break;
      case 'spherical':
        phase = currentAmplitude * Math.pow(r, 4);
        break;
    }
    
    // Simplified PSF calculation - height represents intensity
    const intensity = Math.exp(-Math.pow(phase, 2) * 5); 
    vertices[i + 2] = intensity;
  }
  
  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
  
  // Create material
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: false,
    shininess: 50
  });
  
  // Create mesh
  psf3D.mesh = new THREE.Mesh(geometry, material);
  psf3D.scene.add(psf3D.mesh);
}

// Animation loop for 3D wavefront
function animate3D() {
  wavefront3D.animationId = requestAnimationFrame(animate3D);
  
  if (wavefront3D.controls) {
    wavefront3D.controls.update();
  }
  
  if (wavefront3D.renderer && wavefront3D.scene && wavefront3D.camera) {
    wavefront3D.renderer.render(wavefront3D.scene, wavefront3D.camera);
  }
}

// Animation loop for 3D PSF
function animatePSF3D() {
  psf3D.animationId = requestAnimationFrame(animatePSF3D);
  
  if (psf3D.controls) {
    psf3D.controls.update();
  }
  
  if (psf3D.renderer && psf3D.scene && psf3D.camera) {
    psf3D.renderer.render(psf3D.scene, psf3D.camera);
  }
}

// Update 2D wavefront visualization
function updateWavefront2D() {
  if (!wavefront2D.canvas || !wavefront2D.ctx) return;
  
  const canvas = wavefront2D.canvas;
  const ctx = wavefront2D.ctx;
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw wavefront phase
  const cellSize = Math.min(width, height) / resolution;
  const scale = zoom / 100;
  
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      // Calculate position in unit circle
      const x = (i / (resolution - 1) - 0.5) * 2 * scale;
      const y = (j / (resolution - 1) - 0.5) * 2 * scale;
      
      // Skip if outside unit circle
      const r = Math.sqrt(x * x + y * y);
      if (r > 1) continue;
      
      const theta = Math.atan2(y, x);
      
      // Calculate phase
      let phase = 0;
      
      switch (currentAberration) {
        case 'astigmatism-2fold':
          phase = currentAmplitude * r * r * Math.cos(2 * (theta - currentRotation * Math.PI / 180));
          break;
        case 'astigmatism-3fold':
          phase = currentAmplitude * r * r * r * Math.cos(3 * (theta - currentRotation * Math.PI / 180));
          break;
        case 'coma':
          phase = currentAmplitude * r * r * r * Math.cos(theta - currentRotation * Math.PI / 180);
          break;
        case 'spherical':
          phase = currentAmplitude * Math.pow(r, 4);
          break;
      }
      
      // Normalize phase to color
      const normalizedPhase = (phase + 1) / 2;
      
      // Create color gradient (blue to red)
      const r1 = Math.floor(normalizedPhase * 255);
      const g1 = 0;
      const b1 = Math.floor((1 - normalizedPhase) * 255);
      
      // Calculate screen position
      const screenX = (i / (resolution - 1)) * width;
      const screenY = (j / (resolution - 1)) * height;
      
      ctx.fillStyle = `rgb(${r1}, ${g1}, ${b1})`;
      ctx.fillRect(screenX - cellSize/2, screenY - cellSize/2, cellSize, cellSize);
    }
  }
  
  // Draw circle outline
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, Math.min(width, height) / 2 * (1 / scale), 0, Math.PI * 2);
  ctx.stroke();
}

// Update PSF visualization
function updatePSF() {
  if (!psf.canvas || !psf.ctx) return;
  
  const canvas = psf.canvas;
  const ctx = psf.ctx;
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw PSF intensity
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calculate position in unit circle
      const normX = (x / width - 0.5) * 2;
      const normY = (y / height - 0.5) * 2;
      
      // Calculate PSF intensity (simplified)
      const r = Math.sqrt(normX * normX + normY * normY);
      
      // Skip if outside unit circle
      if (r > 1) continue;
      
      const theta = Math.atan2(normY, normX);
      
      // Calculate phase
      let phase = 0;
      
      switch (currentAberration) {
        case 'astigmatism-2fold':
          phase = currentAmplitude * r * r * Math.cos(2 * (theta - currentRotation * Math.PI / 180));
          break;
        case 'astigmatism-3fold':
          phase = currentAmplitude * r * r * r * Math.cos(3 * (theta - currentRotation * Math.PI / 180));
          break;
        case 'coma':
          phase = currentAmplitude * r * r * r * Math.cos(theta - currentRotation * Math.PI / 180);
          break;
        case 'spherical':
          phase = currentAmplitude * Math.pow(r, 4);
          break;
      }
      
      // Simplified PSF intensity
      const intensity = Math.exp(-Math.pow(phase, 2) * 5);
      
      // Set pixel data
      const idx = (y * width + x) * 4;
      data[idx] = data[idx + 1] = data[idx + 2] = intensity * 255;
      data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// Update all visualizations
function updateVisualizations() {
  updateWavefront3D();
  updateWavefront2D();
  updatePSF();
}

// Update 3D wavefront
function updateWavefront3D() {
  if (!wavefront3D.mesh) return;
  
  const vertices = wavefront3D.mesh.geometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    
    // Convert to polar coordinates
    const r = Math.sqrt(x * x + y * y);
    let theta = Math.atan2(y, x);
    
    // Apply aberration
    let z = 0;
    
    switch (currentAberration) {
      case 'astigmatism-2fold':
        z = currentAmplitude * r * r * Math.cos(2 * (theta - currentRotation * Math.PI / 180));
        break;
      case 'astigmatism-3fold':
        z = currentAmplitude * r * r * r * Math.cos(3 * (theta - currentRotation * Math.PI / 180));
        break;
      case 'coma':
        z = currentAmplitude * r * r * r * Math.cos(theta - currentRotation * Math.PI / 180);
        break;
      case 'spherical':
        z = currentAmplitude * Math.pow(r, 4);
        break;
    }
    
    vertices[i + 2] = z;
  }
  
  wavefront3D.mesh.geometry.attributes.position.needsUpdate = true;
  wavefront3D.mesh.geometry.computeVertexNormals();
}
