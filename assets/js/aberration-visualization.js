// Aberration Visualization JavaScript
// This script implements the interactive aberration visualization tool

document.addEventListener('DOMContentLoaded', function() {
  // Initialize tabs
  initTabs();
  
  // Initialize Three.js scenes
  initWavefrontVisualizations();
  initPSFVisualizations();
  initCompareVisualizations();
  
  // Initialize event listeners for controls
  initControlListeners();
});

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
  
  amplitudeSlider.addEventListener('input', function() {
    currentAmplitude = this.value / 100;
    amplitudeValue.textContent = currentAmplitude.toFixed(1);
    updateVisualizations();
  });
  
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
  
  rotationSlider.addEventListener('input', function() {
    currentRotation = parseInt(this.value);
    rotationValue.textContent = currentRotation + '°';
    updateVisualizations();
  });
  
  // Resolution slider
  const resolutionSlider = document.getElementById('resolution-slider');
  const resolutionValue = document.getElementById('resolution-value');
  
  resolutionSlider.addEventListener('input', function() {
    resolution = parseInt(this.value);
    resolutionValue.textContent = resolution;
    resetWavefront3D();
  });
  
  // Zoom slider
  const zoomSlider = document.getElementById('zoom-slider');
  const zoomValue = document.getElementById('zoom-value');
  
  zoomSlider.addEventListener('input', function() {
    zoom = parseInt(this.value);
    zoomValue.textContent = zoom + '%';
    updateVisualizations();
  });
  
  // Animation slider
  const animationSlider = document.getElementById('animation-slider');
  const animationValue = document.getElementById('animation-value');
  
  animationSlider.addEventListener('input', function() {
    animationSpeed = parseInt(this.value);
    animationValue.textContent = animationSpeed + '%';
  });
  
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
  if (!canvas3D) return;
  
  const width = canvas3D.clientWidth;
  const height = canvas3D.clientHeight;
  
  // Create scene, camera, renderer
  wavefront3D.scene = new THREE.Scene();
  wavefront3D.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  wavefront3D.renderer = new THREE.WebGLRenderer({ canvas: canvas3D, antialias: true });
  wavefront3D.renderer.setSize(width, height);
  
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
    wavefront2D.ctx = wavefront2D.canvas.getContext('2d');
    updateWavefront2D();
  }
}

// Initialize the PSF visualizations
function initPSFVisualizations() {
  psf.canvas = document.getElementById('psf-canvas');
  if (psf.canvas) {
    psf.ctx = psf.canvas.getContext('2d');
    updatePSF();
  }
  
  // Initialize 3D PSF
  const psf3DCanvas = document.getElementById('psf-3d');
  if (!psf3DCanvas) return;
  
  const width = psf3DCanvas.clientWidth;
  const height = psf3DCanvas.clientHeight;
  
  // Create scene, camera, renderer
  psf3D.scene = new THREE.Scene();
  psf3D.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  psf3D.renderer = new THREE.WebGLRenderer({ canvas: psf3DCanvas, antialias: true });
  psf3D.renderer.setSize(width, height);
  
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
  
  if (compareCanvases.astig2) {
    updateComparisonViews();
  }
}

// Create 3D wavefront mesh
function createWavefront3DMesh() {
  if (!wavefront3D.scene) return;
  
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

// Create 3D PSF mesh
function createPSF3DMesh() {
  if (!psf3D.scene) return;
  
  // Remove existing mesh if any
  if (psf3D.mesh) {
    psf3D.scene.remove(psf3D.mesh);
    psf3D.mesh.geometry.dispose();
    psf3D.mesh.material.dispose();
  }
  
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
    }
    
    // Simplified PSF calculation
    let intensity = Math.exp(-Math.pow(phase, 2) * 5);
    intensity = Math.max(0, Math.min(1, intensity));
    
    vertices[i + 2] = intensity;
  }
  
  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
  
  // Create material with vertex colors
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: false,
    shininess: 50,
    vertexColors: true
  });
  
  // Create mesh
  psf3D.mesh = new THREE.Mesh(geometry, material);
  psf3D.scene.add(psf3D.mesh);
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

// Update 2D wavefront map
function updateWavefront2D() {
  if (!wavefront2D.canvas || !wavefront2D.ctx) return;
  
  const canvas = wavefront2D.canvas;
  const ctx = wavefront2D.ctx;
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw wavefront phase
  const cellSize = width / resolution;
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
      
      ctx.fillStyle = `rgb(${r1}, ${g1}, ${b1})`;
      ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
  
  // Draw circle outline
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, width / 2 * (1 / scale), 0, Math.PI * 2);
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
  
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      // Calculate position in unit circle
      const x = (i / width - 0.5) * 2;
      const y = (j / height - 0.5) * 2;
      
      // Calculate PSF intensity (simplified)
      const r = Math.sqrt(x * x + y * y);
      const theta = Math.atan2(y, x);
      
      // Skip if outside unit circle
      if (r > 1) continue;
      
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
      const idx = (j * width + i) * 4;
      data[idx] = data[idx + 1] = data[idx + 2] = intensity * 255;
      data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Update PSF 3D visualization
  if (psf3D.mesh) {
    updatePSF3D();
  }
}

// Update 3D PSF visualization
function updatePSF3D() {
  if (!psf3D.mesh) return;
  
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
    
    // Simplified PSF calculation
    let intensity = Math.exp(-Math.pow(phase, 2) * 5);
    intensity = Math.max(0, Math.min(1, intensity));
    
    vertices[i + 2] = intensity;
  }
  
  psf3D.mesh.geometry.attributes.position.needsUpdate = true;
  psf3D.mesh.geometry.computeVertexNormals();
}

// Update comparison views
function updateComparisonViews() {
  if (!compareCanvases.astig2) return;
  
  const amplitude = parseFloat(document.getElementById('compare-amplitude-slider').value) / 100;
  const compareResolution = parseInt(document.getElementById('compare-resolution-slider').value);
  
  // Draw each aberration type
  drawAberrationToCanvas(compareCanvases.astig2, 'astigmatism-2fold', amplitude, 0, compareResolution);
  drawAberrationToCanvas(compareCanvases.astig3, 'astigmatism-3fold', amplitude, 0, compareResolution);
  drawAberrationToCanvas(compareCanvases.coma, 'coma', amplitude, 0, compareResolution);
  drawAberrationToCanvas(compareCanvases.spherical, 'spherical', amplitude, 0, compareResolution);
}

// Draw aberration to canvas
function drawAberrationToCanvas(canvas, aberrationType, amplitude, rotation, resolution) {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  if (compareView === 'wavefront') {
    // Draw wavefront phase
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        // Calculate position in unit circle
        const x = (i / width - 0.5) * 2;
        const y = (j / height - 0.5) * 2;
        
        // Skip if outside unit circle
        const r = Math.sqrt(x * x + y * y);
        if (r > 1) continue;
        
        const theta = Math.atan2(y, x);
        
        // Calculate phase
        let phase = 0;
        
        switch (aberrationType) {
          case 'astigmatism-2fold':
            phase = amplitude * r * r * Math.cos(2 * (theta - rotation * Math.PI / 180));
            break;
          case 'astigmatism-3fold':
            phase = amplitude * r * r * r * Math.cos(3 * (theta - rotation * Math.PI / 180));
            break;
          case 'coma':
            phase = amplitude * r * r * r * Math.cos(theta - rotation * Math.PI / 180);
            break;
          case 'spherical':
            phase = amplitude * Math.pow(r, 4);
            break;
        }
        
        // Normalize phase to color
        const normalizedPhase = (phase + 1) / 2;
        
        // Create color gradient (blue to red)
        const r1 = Math.floor(normalizedPhase * 255);
        const g1 = 0;
        const b1 = Math.floor((1 - normalizedPhase) * 255);
        
        // Set pixel data
        const idx = (j * width + i) * 4;
        data[idx] = r1;
        data[idx + 1] = g1;
        data[idx + 2] = b1;
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  } else {
    // Draw PSF intensity
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        // Calculate position in unit circle
        const x = (i / width - 0.5) * 2;
        const y = (j / height - 0.5) * 2;
        
        // Skip if outside unit circle
        const r = Math.sqrt(x * x + y * y);
        if (r > 1) continue;
        
        const theta = Math.atan2(y, x);
        
        // Calculate phase
        let phase = 0;
        
        switch (aberrationType) {
          case 'astigmatism-2fold':
            phase = amplitude * r * r * Math.cos(2 * (theta - rotation * Math.PI / 180));
            break;
          case 'astigmatism-3fold':
            phase = amplitude * r * r * r * Math.cos(3 * (theta - rotation * Math.PI / 180));
            break;
          case 'coma':
            phase = amplitude * r * r * r * Math.cos(theta - rotation * Math.PI / 180);
            break;
          case 'spherical':
            phase = amplitude * Math.pow(r, 4);
            break;
        }
        
        // Simplified PSF intensity
        const intensity = Math.exp(-Math.pow(phase, 2) * 5);
        
        // Set pixel data
        const idx = (j * width + i) * 4;
        data[idx] = data[idx + 1] = data[idx + 2] = intensity * 255;
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
  
  // Draw circle outline
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
  ctx.stroke();
}

// Animation loop for 3D wavefront
function animate3D() {
  wavefront3D.animationId = requestAnimationFrame(animate3D);
  
  // Apply subtle animation
  if (wavefront3D.mesh) {
    wavefront3D.mesh.rotation.x += 0.001 * (animationSpeed / 50);
    wavefront3D.mesh.rotation.y += 0.001 * (animationSpeed / 50);
  }
  
  // Update controls and render
  wavefront3D.controls.update();
  wavefront3D.renderer.render(wavefront3D.scene, wavefront3D.camera);
}

// Animation loop for 3D PSF
function animatePSF3D() {
  psf3D.animationId = requestAnimationFrame(animatePSF3D);
  
  // Apply subtle animation
  if (psf3D.mesh) {
    psf3D.mesh.rotation.x += 0.001 * (animationSpeed / 50);
    psf3D.mesh.rotation.y += 0.001 * (animationSpeed / 50);
  }
  
  // Update controls and render
  psf3D.controls.update();
  psf3D.renderer.render(psf3D.scene, psf3D.camera);
}

// Handle window resize
window.addEventListener('resize', function() {
  // Resize 3D canvas
  if (wavefront3D.renderer && wavefront3D.camera) {
    const canvas = wavefront3D.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    wavefront3D.camera.aspect = width / height;
    wavefront3D.camera.updateProjectionMatrix();
    wavefront3D.renderer.setSize(width, height, false);
  }
  
  // Resize PSF 3D canvas
  if (psf3D.renderer && psf3D.camera) {
    const canvas = psf3D.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    psf3D.camera.aspect = width / height;
    psf3D.camera.updateProjectionMatrix();
    psf3D.renderer.setSize(width, height, false);
  }
});