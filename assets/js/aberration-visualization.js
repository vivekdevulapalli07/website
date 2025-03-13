// Aberration Visualization JavaScript
// This script implements the interactive aberration visualization tool

// Wait for both document and all resources (including scripts) to be fully loaded
window.addEventListener('load', function() {
  // Check if Three.js is available
  if (typeof THREE === 'undefined') {
    console.error('Three.js is not loaded');
    loadThreeJS().then(() => {
      console.log('Three.js loaded dynamically');
      initializeVisualization();
    }).catch(error => {
      console.error('Failed to load Three.js:', error);
      displayErrorMessage();
    });
  } else {
    console.log('Three.js already loaded');
    initializeVisualization();
  }
});

// Function to load Three.js dynamically if it's not available
function loadThreeJS() {
  return new Promise((resolve, reject) => {
    // Load Three.js
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

// Display error message on canvases if Three.js fails to load
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
      ctx.fillStyle = '#f8d7da';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px Arial';
      ctx.fillStyle = '#721c24';
      ctx.textAlign = 'center';
      ctx.fillText('Error: Three.js could not be loaded', canvas.width/2, canvas.height/2);
      ctx.fillText('Please check your internet connection', canvas.width/2, canvas.height/2 + 20);
    }
  });
}

// Main function to initialize the visualization
function initializeVisualization() {
  // Initialize tabs
  initTabs();
  
  // Give browsers a moment to calculate the canvas sizes properly
  setTimeout(() => {
    // Initialize Three.js scenes
    initWavefrontVisualizations();
    initPSFVisualizations();
    initCompareVisualizations();
    
    // Initialize event listeners for controls
    initControlListeners();
  }, 100);
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

let currentAberration = 'astigmatism-2fold';
let currentAmplitude = 0.5;
let currentRotation = 0;
let resolution = 40;
let zoom = 100;
let animationSpeed = 50;
let compareView = 'wavefront';

// Tab functionality
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons and panes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      // Add active class to clicked button and corresponding pane
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.add('active');
      
      // Special handling for compare tab - initialize if needed
      if (tabId === 'compare') {
        updateComparisonViews();
      }
    });
  });
}

// Aberration selector buttons
function initControlListeners() {
  // Aberration type selectors
  const aberrationButtons = document.querySelectorAll('.aberration-button');
  aberrationButtons.forEach(button => {
    button.addEventListener('click', function() {
      const parentSelector = this.closest('.aberration-selector');
      parentSelector.querySelectorAll('.aberration-button').forEach(btn => {
        btn.classList.remove('active');
      });
      
      this.classList.add('active');
      currentAberration = this.getAttribute('data-type');
      updateVisualizations();
      
      // Show/hide rotation slider based on aberration type
      const rotationContainer = document.getElementById('rotation-container');
      const psfRotationContainer = document.getElementById('psf-rotation-container');
      
      if (currentAberration === 'spherical') {
        rotationContainer.style.display = 'none';
        if (psfRotationContainer) psfRotationContainer.style.display = 'none';
      } else {
        rotationContainer.style.display = 'flex';
        if (psfRotationContainer) psfRotationContainer.style.display = 'flex';
      }
    });
  });
  
  // Amplitude slider
  const amplitudeSlider = document.getElementById('amplitude-slider');
  const amplitudeValue = document.getElementById('amplitude-value');
  
  if (amplitudeSlider) {
    amplitudeSlider.addEventListener('input', function() {
      currentAmplitude = this.value / 100;
      amplitudeValue.textContent = currentAmplitude.toFixed(1);
      updateVisualizations();
    });
  }
  
  // PSF amplitude slider
  const psfAmplitudeSlider = document.getElementById('psf-amplitude-slider');
  const psfAmplitudeValue = document.getElementById('psf-amplitude-value');
  
  if (psfAmplitudeSlider) {
    psfAmplitudeSlider.addEventListener('input', function() {
      currentAmplitude = this.value / 100;
      psfAmplitudeValue.textContent = currentAmplitude.toFixed(1);
      updatePSF();
    });
  }
  
  // Rotation slider
  const rotationSlider = document.getElementById('rotation-slider');
  const rotationValue = document.getElementById('rotation-value');
  
  if (rotationSlider) {
    rotationSlider.addEventListener('input', function() {
      currentRotation = parseInt(this.value);
      rotationValue.textContent = currentRotation + '°';
      updateVisualizations();
    });
  }
  
  // Resolution slider
  const resolutionSlider = document.getElementById('resolution-slider');
  const resolutionValue = document.getElementById('resolution-value');
  
  if (resolutionSlider) {
    resolutionSlider.addEventListener('input', function() {
      resolution = parseInt(this.value);
      resolutionValue.textContent = resolution;
      resetWavefront3D();
    });
  }
  
  // Zoom slider
  const zoomSlider = document.getElementById('zoom-slider');
  const zoomValue = document.getElementById('zoom-value');
  
  if (zoomSlider) {
    zoomSlider.addEventListener('input', function() {
      zoom = parseInt(this.value);
      zoomValue.textContent = zoom + '%';
      updateVisualizations();
    });
  }
  
  // Animation slider
  const animationSlider = document.getElementById('animation-slider');
  const animationValue = document.getElementById('animation-value');
  
  if (animationSlider) {
    animationSlider.addEventListener('input', function() {
      animationSpeed = parseInt(this.value);
      animationValue.textContent = animationSpeed + '%';
    });
  }
  
  // Compare view selector
  const compareViewButtons = document.querySelectorAll('[data-compare-view]');
  compareViewButtons.forEach(button => {
    button.addEventListener('click', function() {
      compareViewButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      compareView = button.getAttribute('data-compare-view');
      updateComparisonViews();
    });
  });
  
  // Compare amplitude slider
  const compareAmplitudeSlider = document.getElementById('compare-amplitude-slider');
  const compareAmplitudeValue = document.getElementById('compare-amplitude-value');
  
  if (compareAmplitudeSlider) {
    compareAmplitudeSlider.addEventListener('input', function() {
      const amplitude = this.value / 100;
      compareAmplitudeValue.textContent = amplitude.toFixed(1);
      updateComparisonViews();
    });
  }
}

// Initialize the 3D wavefront visualizations
function initWavefrontVisualizations() {
  // Initialize 3D wavefront
  const canvas3D = document.getElementById('wavefront-3d');
  if (!canvas3D) {
    console.error('Could not find wavefront-3d canvas');
    return;
  }
  
  // Ensure canvas has the right dimensions
  resizeCanvas(canvas3D);
  
  const width = canvas3D.width;
  const height = canvas3D.height;
  
  // Create scene, camera, renderer
  wavefront3D.scene = new THREE.Scene();
  wavefront3D.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  wavefront3D.renderer = new THREE.WebGLRenderer({ 
    canvas: canvas3D, 
    antialias: true,
    alpha: true 
  });
  wavefront3D.renderer.setSize(width, height, false);
  wavefront3D.renderer.setClearColor(0xf0f0f0, 1);
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  wavefront3D.scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  wavefront3D.scene.add(directionalLight);
  
  // Add orbit controls
  wavefront3D.controls = new THREE.OrbitControls(wavefront3D.camera, wavefront3D.renderer.domElement);
  wavefront3D.controls.enableDamping = true;
  wavefront3D.controls.dampingFactor = 0.05;
  
  // Position camera
  wavefront3D.camera.position.z = 5;
  
  // Create initial wavefront mesh
  createWavefront3DMesh();
  
  // Start animation loop
  animate3D();
  
  // Initialize 2D wavefront
  wavefront2D.canvas = document.getElementById('wavefront-2d');
  if (wavefront2D.canvas) {
    resizeCanvas(wavefront2D.canvas);
    wavefront2D.ctx = wavefront2D.canvas.getContext('2d');
    updateWavefront2D();
  } else {
    console.error('Could not find wavefront-2d canvas');
  }
}

// Make sure the canvas has the right dimensions
function resizeCanvas(canvas) {
  // Get the display width and height
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  
  // Check if the canvas is not the same size
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    // Set the canvas to the same size as it is displayed
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    console.log(`Resized canvas ${canvas.id} to ${displayWidth}x${displayHeight}`);
  }
}

// Initialize the PSF visualizations
function initPSFVisualizations() {
  psf.canvas = document.getElementById('psf-canvas');
  if (psf.canvas) {
    resizeCanvas(psf.canvas);
    psf.ctx = psf.canvas.getContext('2d');
    updatePSF();
  } else {
    console.error('Could not find psf-canvas');
  }
  
  // Initialize 3D PSF
  const psf3DCanvas = document.getElementById('psf-3d');
  if (!psf3DCanvas) {
    console.error('Could not find psf-3d canvas');
    return;
  }
  
  // Ensure canvas has the right dimensions
  resizeCanvas(psf3DCanvas);
  
  const width = psf3DCanvas.width;
  const height = psf3DCanvas.height;
  
  // Create scene, camera, renderer
  psf3D.scene = new THREE.Scene();
  psf3D.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  psf3D.renderer = new THREE.WebGLRenderer({ 
    canvas: psf3DCanvas, 
    antialias: true,
    alpha: true 
  });
  psf3D.renderer.setSize(width, height, false);
  psf3D.renderer.setClearColor(0xf0f0f0, 1);
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  psf3D.scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  psf3D.scene.add(directionalLight);
  
  // Add orbit controls
  psf3D.controls = new THREE.OrbitControls(psf3D.camera, psf3D.renderer.domElement);
  psf3D.controls.enableDamping = true;
  psf3D.controls.dampingFactor = 0.05;
  
  // Position camera
  psf3D.camera.position.z = 5;
  
  // Create initial PSF 3D visualization
  createPSF3DMesh();
  
  // Start animation loop
  animatePSF3D();
}

// Initialize the comparison visualizations
function initCompareVisualizations() {
  compareCanvases.astig2 = document.getElementById('compare-astig2');
  compareCanvases.astig3 = document.getElementById('compare-astig3');
  compareCanvases.coma = document.getElementById('compare-coma');
  compareCanvases.spherical = document.getElementById('compare-spherical');
  
  // Resize all canvases
  for (const key in compareCanvases) {
    if (compareCanvases[key]) {
      resizeCanvas(compareCanvases[key]);
    } else {
      console.error(`Could not find ${key} canvas`);
    }
  }
  
  if (compareCanvases.astig2) {
    updateComparisonViews();
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
  
  try {
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
    
    console.log('Wavefront 3D mesh created successfully');
  } catch (error) {
    console.error('Error creating wavefront 3D mesh:', error);
  }
}

// Create 3D PSF mesh
function createPSF3DMesh() {
  if (!psf3D.scene) {
    console.error('psf3D.scene is not initialized');
    return;
  }
  
  // Remove existing mesh if any
  if (psf3D.mesh) {
    psf3D.scene.remove(psf3D.mesh);
    psf3D.mesh.geometry.dispose();
    psf3D.mesh.material.dispose();
  }
  
  try {
    // Create geometry for the PSF intensity distribution
    const geometry = new THREE.PlaneGeometry(4, 4, resolution - 1, resolution - 1);
    
    // Calculate PSF distribution (simplified for visualization)
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      
      // Convert to polar coordinates
      const r = Math.sqrt(x * x + y * y);
      let theta = Math.atan2(y, x);
      
      // Apply aberration phase to get PSF intensity (simplified)
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
      }cos(2 * (theta - currentRotation * Math.PI / 180));
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
      
      // Simplified PSF calculation
      let intensity = Math.exp(-Math.pow(phase, 2) * 5);
      intensity = Math.max(0, Math.min(1, intensity));
      
      vertices[i + 2] = intensity;
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    // Create material with basic phong material
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      wireframe: false,
      shininess: 50
    });
    
    // Create mesh
    psf3D.mesh = new THREE.Mesh(geometry, material);
    psf3D.scene.add(psf3D.mesh);
    
    console.log('PSF 3D mesh created successfully');
  } catch (error) {
    console.error('Error creating PSF 3D mesh:', error);
  }
}

// Update all visualizations
function updateVisualizations() {
  updateWavefront3D();
  updateWavefront2D();
  updatePSF();
}

// Reset and update 3D wavefront
function resetWavefront3D() {
  createWavefront3DMesh();
}

// Update 3D wavefront
function updateWavefront3D() {
  if (!wavefront3D.mesh) {
    console.error('wavefront3D.mesh is not initialized');
    return;
  }
  
  try {
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
  } catch (error) {
    console.error('Error updating wavefront 3D:', error);
  }
}

// Update 2D wavefront map
function updateWavefront2D() {
  if (!wavefront2D.canvas || !wavefront2D.ctx) {
    console.error('wavefront2D canvas or context is not initialized');
    return;
  }
  
  try {
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
        
        // Check if point is within unit circle
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
  } catch (error) {
    console.error('Error updating wavefront 2D:', error);
  }
}

// Update PSF visualization
function updatePSF() {
  if (!psf.canvas || !psf.ctx) {
    console.error('PSF canvas or context is not initialized');
    return;
  }
  
  try {
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
    
    // Update PSF 3D visualization
    if (psf3D.mesh) {
      updatePSF3D();
    }
  } catch (error) {
    console.error('Error updating PSF:', error);
  }
}

// Update 3D PSF visualization
function updatePSF3D() {
  if (!psf3D.mesh) {
    console.error('psf3D.mesh is not initialized');
    return;
  }
  
  try {
    const vertices = psf3D.mesh.geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      
      // Convert to polar coordinates
      const r = Math.sqrt(x * x + y * y);
      let theta = Math.atan2(y, x);
      
      // Apply aberration phase
      let phase = 0;
      
      switch (currentAberration) {
        case 'astigmatism-2fold':
          phase = currentAmplitude * r * r * Math.