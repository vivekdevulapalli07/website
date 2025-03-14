// Aberration Visualization JavaScript
// This script implements the interactive aberration visualization tool with fixes

// Global state
window.aberrationState = {
  currentAberration: 'astigmatism-2fold',
  currentAmplitude: 0.5,
  currentRotation: 0,
  resolution: 40,
  zoom: 100,
  animationSpeed: 50
};

// Global visualization objects
window.visualizations = {
  wavefront3D: {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    mesh: null,
    animationId: null
  },
  wavefront2D: {
    canvas: null,
    ctx: null
  },
  psf: {
    canvas: null,
    ctx: null
  },
  psf3D: {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    mesh: null,
    animationId: null
  },
  compareCanvases: {
    astig2: null,
    astig3: null,
    coma: null,
    spherical: null
  }
};

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
        
        // Important: trigger a resize event to make sure canvases are properly sized
        window.dispatchEvent(new Event('resize'));
        
        // Initialize canvases specific to this tab
        if (tabId === 'psf') {
          setTimeout(() => {
            initPSFCanvases();
            updatePSF();
          }, 100);
        } else if (tabId === 'compare') {
          setTimeout(() => {
            initCompareCanvases();
          }, 100);
        } else if (tabId === 'wavefront') {
          setTimeout(() => {
            if (window.visualizations.wavefront3D.renderer) {
              window.visualizations.wavefront3D.renderer.setSize(
                window.visualizations.wavefront3D.renderer.domElement.clientWidth,
                window.visualizations.wavefront3D.renderer.domElement.clientHeight
              );
            }
            if (window.visualizations.wavefront2D.canvas) {
              ensureCanvasDimensions(window.visualizations.wavefront2D.canvas);
              updateWavefront2D();
            }
          }, 100);
        }
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

// Initialize control listeners
function initControlListeners() {
  console.log('Setting up control listeners');
  
  // Aberration type selectors
  const aberrationButtons = document.querySelectorAll('.aberration-button');
  aberrationButtons.forEach(button => {
    button.addEventListener('click', function() {
      const aberrationType = this.getAttribute('data-type');
      if (!aberrationType) return;
      
      window.aberrationState.currentAberration = aberrationType;
      
      // Update all aberration button sets
      document.querySelectorAll('.aberration-selector').forEach(selector => {
        selector.querySelectorAll('.aberration-button').forEach(btn => {
          if (btn.getAttribute('data-type') === aberrationType) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      });
      
      // Show/hide rotation controls based on aberration type
      const rotationContainers = document.querySelectorAll('#rotation-container, #psf-rotation-container');
      rotationContainers.forEach(container => {
        if (container) {
          container.style.display = aberrationType === 'spherical' ? 'none' : 'flex';
        }
      });
      
      // Update visualizations
      updateVisualizations();
    });
  });
  
  // Amplitude sliders
  const amplitudeSlider = document.getElementById('amplitude-slider');
  const psfAmplitudeSlider = document.getElementById('psf-amplitude-slider');
  const amplitudeValue = document.getElementById('amplitude-value');
  const psfAmplitudeValue = document.getElementById('psf-amplitude-value');
  
  if (amplitudeSlider && amplitudeValue) {
    // Sync initial values if PSF slider exists
    if (psfAmplitudeSlider) {
      psfAmplitudeSlider.value = amplitudeSlider.value;
    }
    
    amplitudeSlider.addEventListener('input', function() {
      window.aberrationState.currentAmplitude = parseInt(this.value) / 100;
      amplitudeValue.textContent = window.aberrationState.currentAmplitude.toFixed(1);
      
      if (psfAmplitudeSlider && psfAmplitudeValue) {
        psfAmplitudeSlider.value = this.value;
        psfAmplitudeValue.textContent = window.aberrationState.currentAmplitude.toFixed(1);
      }
      
      updateVisualizations();
    });
    
    if (psfAmplitudeSlider && psfAmplitudeValue) {
      psfAmplitudeSlider.addEventListener('input', function() {
        window.aberrationState.currentAmplitude = parseInt(this.value) / 100;
        psfAmplitudeValue.textContent = window.aberrationState.currentAmplitude.toFixed(1);
        
        if (amplitudeSlider && amplitudeValue) {
          amplitudeSlider.value = this.value;
          amplitudeValue.textContent = window.aberrationState.currentAmplitude.toFixed(1);
        }
        
        updateVisualizations();
      });
    }
  }
  
  // Rotation sliders
  const rotationSlider = document.getElementById('rotation-slider');
  const psfRotationSlider = document.getElementById('psf-rotation-slider');
  const rotationValue = document.getElementById('rotation-value');
  const psfRotationValue = document.getElementById('psf-rotation-value');
  
  if (rotationSlider && rotationValue) {
    // Sync initial values if PSF slider exists
    if (psfRotationSlider) {
      psfRotationSlider.value = rotationSlider.value;
    }
    
    rotationSlider.addEventListener('input', function() {
      window.aberrationState.currentRotation = parseInt(this.value);
      rotationValue.textContent = window.aberrationState.currentRotation + '°';
      
      if (psfRotationSlider && psfRotationValue) {
        psfRotationSlider.value = this.value;
        psfRotationValue.textContent = window.aberrationState.currentRotation + '°';
      }
      
      updateVisualizations();
    });
    
    if (psfRotationSlider && psfRotationValue) {
      psfRotationSlider.addEventListener('input', function() {
        window.aberrationState.currentRotation = parseInt(this.value);
        psfRotationValue.textContent = window.aberrationState.currentRotation + '°';
        
        if (rotationSlider && rotationValue) {
          rotationSlider.value = this.value;
          rotationValue.textContent = window.aberrationState.currentRotation + '°';
        }
        
        updateVisualizations();
      });
    }
  }
  
  // Resolution slider
  const resolutionSlider = document.getElementById('resolution-slider');
  const resolutionValue = document.getElementById('resolution-value');
  
  if (resolutionSlider && resolutionValue) {
    resolutionSlider.addEventListener('input', function() {
      window.aberrationState.resolution = parseInt(this.value);
      resolutionValue.textContent = window.aberrationState.resolution;
      createWavefront3DMesh();
      if (window.visualizations.psf3D.mesh) {
        createPSF3DMesh();
      }
    });
  }
  
  // Zoom slider
  const zoomSlider = document.getElementById('zoom-slider');
  const zoomValue = document.getElementById('zoom-value');
  
  if (zoomSlider && zoomValue) {
    zoomSlider.addEventListener('input', function() {
      window.aberrationState.zoom = parseInt(this.value);
      zoomValue.textContent = window.aberrationState.zoom + '%';
      updateWavefront2D();
    });
  }
  
  // Compare tab controls
  const compareViewButtons = document.querySelectorAll('[data-compare-view]');
  compareViewButtons.forEach(button => {
    button.addEventListener('click', function() {
      compareViewButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Update comparison canvases
      updateCompareCanvases();
    });
  });
  
  const compareAmplitudeSlider = document.getElementById('compare-amplitude-slider');
  const compareAmplitudeValue = document.getElementById('compare-amplitude-value');
  
  if (compareAmplitudeSlider && compareAmplitudeValue) {
    compareAmplitudeSlider.addEventListener('input', function() {
      const value = parseInt(this.value) / 100;
      compareAmplitudeValue.textContent = value.toFixed(1);
      updateCompareCanvases();
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
  window.visualizations.wavefront3D.scene = new THREE.Scene();
  window.visualizations.wavefront3D.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  window.visualizations.wavefront3D.renderer = new THREE.WebGLRenderer({ 
    canvas: canvas3D, 
    antialias: true 
  });
  window.visualizations.wavefront3D.renderer.setSize(width, height);
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  window.visualizations.wavefront3D.scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  window.visualizations.wavefront3D.scene.add(directionalLight);
  
  // Add orbit controls
  window.visualizations.wavefront3D.controls = new THREE.OrbitControls(
    window.visualizations.wavefront3D.camera, 
    window.visualizations.wavefront3D.renderer.domElement
  );
  
  // Position camera
  window.visualizations.wavefront3D.camera.position.z = 5;
  
  // Create mesh
  createWavefront3DMesh();
  
  // Start animation loop
  animate3D();
  
  // Initialize 2D wavefront
  window.visualizations.wavefront2D.canvas = document.getElementById('wavefront-2d');
  if (window.visualizations.wavefront2D.canvas) {
    ensureCanvasDimensions(window.visualizations.wavefront2D.canvas);
    window.visualizations.wavefront2D.ctx = window.visualizations.wavefront2D.canvas.getContext('2d');
    updateWavefront2D();
  }
}

// Initialize PSF canvases with proper dimensions
function initPSFCanvases() {
  const psfCanvas = document.getElementById('psf-canvas');
  const psf3dCanvas = document.getElementById('psf-3d');
  
  if (psfCanvas) {
    ensureCanvasDimensions(psfCanvas);
    window.visualizations.psf.canvas = psfCanvas;
    window.visualizations.psf.ctx = psfCanvas.getContext('2d');
    console.log('PSF Canvas dimensions:', psfCanvas.width, psfCanvas.height);
  }
  
  if (psf3dCanvas) {
    ensureCanvasDimensions(psf3dCanvas);
    console.log('PSF 3D Canvas dimensions:', psf3dCanvas.width, psf3dCanvas.height);
    
    // Initialize 3D scene if needed
    if (!window.visualizations.psf3D.scene) {
      initPSF3D(psf3dCanvas);
    }
  }
}

// Initialize PSF visualizations
function initPSFVisualizations() {
  console.log('Initializing PSF visualizations');
  
  // Setup PSF 2D canvas
  window.visualizations.psf.canvas = document.getElementById('psf-canvas');
  if (window.visualizations.psf.canvas) {
    ensureCanvasDimensions(window.visualizations.psf.canvas);
    window.visualizations.psf.ctx = window.visualizations.psf.canvas.getContext('2d');
    updatePSF();
  }
  
  // Setup PSF 3D canvas
  const psf3DCanvas = document.getElementById('psf-3d');
  if (psf3DCanvas) {
    initPSF3D(psf3DCanvas);
  }
}

// Initialize 3D PSF visualization
function initPSF3D(canvas) {
  if (!canvas) return;
  
  // Ensure canvas has dimensions
  ensureCanvasDimensions(canvas);
  
  const width = canvas.width;
  const height = canvas.height;
  
  // Ensure THREE.js is available
  if (typeof THREE === 'undefined') {
    console.error('THREE.js not available');
    return;
  }
  
  // Initialize 3D PSF scene
  window.visualizations.psf3D.scene = new THREE.Scene();
  window.visualizations.psf3D.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  window.visualizations.psf3D.renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    antialias: true 
  });
  window.visualizations.psf3D.renderer.setSize(width, height);
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  window.visualizations.psf3D.scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  window.visualizations.psf3D.scene.add(directionalLight);
  
  // Add orbit controls
  window.visualizations.psf3D.controls = new THREE.OrbitControls(
    window.visualizations.psf3D.camera, 
    window.visualizations.psf3D.renderer.domElement
  );
  
  // Position camera
  window.visualizations.psf3D.camera.position.z = 5;
  
  // Create mesh
  createPSF3DMesh();
  
  // Start animation loop
  animatePSF3D();
}

// Initialize compare tab canvases
function initCompareCanvases() {
  const canvases = [
    document.getElementById('compare-astig2'),
    document.getElementById('compare-astig3'),
    document.getElementById('compare-coma'),
    document.getElementById('compare-spherical')
  ];
  
  canvases.forEach(canvas => {
    if (canvas) {
      ensureCanvasDimensions(canvas);
      renderCompareView(canvas, canvas.id.replace('compare-', ''));
    }
  });
}

// Ensure canvas has proper dimensions
function ensureCanvasDimensions(canvas) {
  if (!canvas) return;
  
  const container = canvas.parentElement;
  if (container) {
    const width = container.clientWidth;
    const height = container.clientHeight || width; // Square if height not defined
    
    // Only update if dimensions have changed
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      console.log(`Canvas ${canvas.id} sized to ${width}x${height}`);
    }
  }
}

// Create 3D wavefront mesh
function createWavefront3DMesh() {
  const wavefront3D = window.visualizations.wavefront3D;
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
  
  const resolution = window.aberrationState.resolution;
  
  // Create geometry for the wavefront
  const geometry = new THREE.PlaneGeometry(4, 4, resolution - 1, resolution - 1);
  
  // Apply aberration to vertices
  updateWavefront3DMeshVertices(geometry);
  
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

// Update wavefront 3D mesh vertices
function updateWavefront3DMeshVertices(geometry) {
  if (!geometry) return;
  
  const vertices = geometry.attributes.position.array;
  const state = window.aberrationState;
  
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    
    // Convert to polar coordinates
    const r = Math.sqrt(x * x + y * y);
    let theta = Math.atan2(y, x);
    
    // Apply aberration
    let z = 0;
    
    switch (state.currentAberration) {
      case 'astigmatism-2fold':
        z = state.currentAmplitude * r * r * Math.cos(2 * (theta - state.currentRotation * Math.PI / 180));
        break;
      case 'astigmatism-3fold':
        z = state.currentAmplitude * r * r * r * Math.cos(3 * (theta - state.currentRotation * Math.PI / 180));
        break;
      case 'coma':
        z = state.currentAmplitude * r * r * r * Math.cos(theta - state.currentRotation * Math.PI / 180);
        break;
      case 'spherical':
        z = state.currentAmplitude * Math.pow(r, 4);
        break;
    }
    
    vertices[i + 2] = z;
  }
  
  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
}

// Create 3D PSF mesh
function createPSF3DMesh() {
  const psf3D = window.visualizations.psf3D;
  if (!psf3D.scene) return;
  
  // Remove existing mesh if any
  if (psf3D.mesh) {
    psf3D.scene.remove(psf3D.mesh);
    psf3D.mesh.geometry.dispose();
    psf3D.mesh.material.dispose();
  }
  
  const resolution = window.aberrationState.resolution;
  
  // Create geometry for the PSF
  const geometry = new THREE.PlaneGeometry(4, 4, resolution - 1, resolution - 1);
  
  // Apply PSF intensity to geometry
  updatePSF3DMeshVertices(geometry);
  
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

// Update PSF 3D mesh vertices
function updatePSF3DMeshVertices(geometry) {
  if (!geometry) return;
  
  const vertices = geometry.attributes.position.array;
  const state = window.aberrationState;
  
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    
    // Convert to polar coordinates
    const r = Math.sqrt(x * x + y * y);
    const theta = Math.atan2(y, x);
    
    // Calculate phase based on aberration type
    let phase = 0;
    
    switch (state.currentAberration) {
      case 'astigmatism-2fold':
        phase = state.currentAmplitude * r * r * Math.cos(2 * (theta - state.currentRotation * Math.PI / 180));
        break;
      case 'astigmatism-3fold':
        phase = state.currentAmplitude * r * r * r * Math.cos(3 * (theta - state.currentRotation * Math.PI / 180));
        break;
      case 'coma':
        phase = state.currentAmplitude * r * r * r * Math.cos(theta - state.currentRotation * Math.PI / 180);
        break;
      case 'spherical':
        phase = state.currentAmplitude * Math.pow(r, 4);
        break;
    }
    
    // Simplified PSF intensity
    const intensity = Math.exp(-Math.pow(phase, 2) * 5);
    vertices[i + 2] = intensity * 2; // Scale for visibility
  }
  
  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
}

// Animation loop for 3D wavefront
function animate3D() {
  const wavefront3D = window.visualizations.wavefront3D;
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
  const psf3D = window.visualizations.psf3D;
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
  const wavefront2D = window.visualizations.wavefront2D;
  if (!wavefront2D.canvas || !wavefront2D.ctx) return;
  
  const canvas = wavefront2D.canvas;
  const ctx = wavefront2D.ctx;
  const width = canvas.width;
  const height = canvas.height;
  const state = window.aberrationState;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw wavefront phase
  const cellSize = Math.min(width, height) / state.resolution;
  const scale = state.zoom / 100;
  
  for (let i = 0; i < state.resolution; i++) {
    for (let j = 0; j < state.resolution; j++) {
      // Calculate position in unit circle
      const x = (i / (state.resolution - 1) - 0.5) * 2 * scale;
      const y = (j / (state.resolution - 1) - 0.5) * 2 * scale;
      
      // Skip if outside unit circle
      const r = Math.sqrt(x * x + y * y);
      if (r > 1) continue;
      
      const theta = Math.atan2(y, x);
      
      // Calculate phase
      let phase = 0;
      
      switch (state.currentAberration) {
        case 'astigmatism-2fold':
          phase = state.currentAmplitude * r * r * Math.cos(2 * (theta - state.currentRotation * Math.PI / 180));
          break;
        case 'astigmatism-3fold':
          phase = state.currentAmplitude * r * r * r * Math.cos(3 * (theta - state.currentRotation * Math.PI / 180));
          break;
        case 'coma':
          phase = state.currentAmplitude * r * r * r * Math.cos(theta - state.currentRotation * Math.PI / 180);
          break;
        case 'spherical':
          phase = state.currentAmplitude * Math.pow(r, 4);
          break;
      }
      
      // Normalize phase to color
      const normalizedPhase = (phase + 1) / 2;
      
      // Create color gradient (blue to red)
      const r1 = Math.floor(normalizedPhase * 255);
      const g1 = 0;
      const b1 = Math.floor((1 - normalizedPhase) * 255);
      
      // Calculate screen position
      const screenX = (i / (state.resolution - 1)) * width;
      const screenY = (j / (state.resolution - 1)) * height;
      
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
  const psf = window.visualizations.psf;
  if (!psf.canvas || !psf.ctx) return;
  
  const canvas = psf.canvas;
  const ctx = psf.ctx;
  const width = canvas.width;
  const height = canvas.height;
  const state = window.aberrationState;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw PSF intensity
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 * 0.9; // 90% of canvas size
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calculate normalized coordinates from center
      const normX = (x - centerX) / radius;
      const normY = (y - centerY) / radius;
      
      // Calculate radial distance
      const r = Math.sqrt(normX * normX + normY * normY);
      
      // Skip if outside unit circle
      if (r > 1) {
        // Make outside transparent
        const idx = (y * width + x) * 4;
        data[idx + 3] = 0; // Alpha channel
        continue;
      }
      
      const theta = Math.atan2(normY, normX);
      
      // Calculate phase based on aberration type
      let phase = 0;
      
      switch (state.currentAberration) {
        case 'astigmatism-2fold':
          phase = state.currentAmplitude * r * r * Math.cos(2 * (theta - state.currentRotation * Math.PI / 180));
          break;
        case 'astigmatism-3fold':
          phase = state.currentAmplitude * r * r * r * Math.cos(3 * (theta - state.currentRotation * Math.PI / 180));
          break;
        case 'coma':
          phase = state.currentAmplitude * r * r * r * Math.cos(theta - state.currentRotation * Math.PI / 180);
          break;
        case 'spherical':
          phase = state.currentAmplitude * Math.pow(r, 4);
          break;
      }
      
      // Simplified PSF intensity calculation
      const intensity = Math.exp(-Math.pow(phase, 2) * 5);
      
      // Set pixel data
      const idx = (y * width + x) * 4;
      data[idx] = data[idx + 1] = data[idx + 2] = intensity * 255;
      data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Also update the 3D PSF visualization
  updatePSF3D();
}

// Update 3D PSF
function updatePSF3D() {
  const psf3D = window.visualizations.psf3D;
  if (!psf3D.mesh) return;
  
  // Update mesh vertices
  updatePSF3DMeshVertices(psf3D.mesh.geometry);
}

// Update all visualizations
function updateVisualizations() {
  updateWavefront3D();
  updateWavefront2D();
  updatePSF();
}

// Update 3D wavefront
function updateWavefront3D() {
  const wavefront3D = window.visualizations.wavefront3D;
  if (!wavefront3D.mesh) return;
  
  // Update mesh vertices
  updateWavefront3DMeshVertices(wavefront3D.mesh.geometry);
}

// Render compare view based on type
function renderCompareView(canvas, type) {
  if (!canvas) return;
  
  // Convert type to proper aberration type
  let aberrationType;
  switch (type) {
    case 'astig2':
      aberrationType = 'astigmatism-2fold';
      break;
    case 'astig3':
      aberrationType = 'astigmatism-3fold';
      break;
    case 'coma':
      aberrationType = 'coma';
      break;
    case 'spherical':
      aberrationType = 'spherical';
      break;
    default:
      aberrationType = 'astigmatism-2fold';
  }
  
  // Get current display mode
  const showPSF = document.querySelector('[data-compare-view="psf"].active') !== null;
  
  // Get amplitude for comparison
  const compareAmplitudeSlider = document.getElementById('compare-amplitude-slider');
  const amplitude = compareAmplitudeSlider ? parseInt(compareAmplitudeSlider.value) / 100 : 0.7;
  
  // Save current state
  const savedAberration = window.aberrationState.currentAberration;
  const savedAmplitude = window.aberrationState.currentAmplitude;
  const savedRotation = window.aberrationState.currentRotation;
  
  // Set temporary state for this render
  window.aberrationState.currentAberration = aberrationType;
  window.aberrationState.currentAmplitude = amplitude;
  window.aberrationState.currentRotation = aberrationType === 'spherical' ? 0 : 45; // Fixed rotation for comparison
  
  // Render appropriate visualization
  if (showPSF) {
    renderPSFToCanvas(canvas);
  } else {
    renderWavefrontToCanvas(canvas);
  }
  
  // Restore state
  window.aberrationState.currentAberration = savedAberration;
  window.aberrationState.currentAmplitude = savedAmplitude;
  window.aberrationState.currentRotation = savedRotation;
}

// Render PSF to a specific canvas
function renderPSFToCanvas(canvas) {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  const state = window.aberrationState;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Create imageData for pixel manipulation
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 * 0.9;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calculate normalized coordinates from center
      const normX = (x - centerX) / radius;
      const normY = (y - centerY) / radius;
      
      // Calculate radial distance
      const r = Math.sqrt(normX * normX + normY * normY);
      
      // Skip if outside unit circle
      if (r > 1) {
        // Make outside transparent
        const idx = (y * width + x) * 4;
        data[idx + 3] = 0; // Alpha channel
        continue;
      }
      
      const theta = Math.atan2(normY, normX);
      
      // Calculate phase based on aberration type
      let phase = 0;
      
      switch (state.currentAberration) {
        case 'astigmatism-2fold':
          phase = state.currentAmplitude * r * r * Math.cos(2 * (theta - state.currentRotation * Math.PI / 180));
          break;
        case 'astigmatism-3fold':
          phase = state.currentAmplitude * r * r * r * Math.cos(3 * (theta - state.currentRotation * Math.PI / 180));
          break;
        case 'coma':
          phase = state.currentAmplitude * r * r * r * Math.cos(theta - state.currentRotation * Math.PI / 180);
          break;
        case 'spherical':
          phase = state.currentAmplitude * Math.pow(r, 4);
          break;
      }
      
      // Simplified PSF intensity calculation
      const intensity = Math.exp(-Math.pow(phase, 2) * 5);
      
      // Set pixel data
      const idx = (y * width + x) * 4;
      data[idx] = data[idx + 1] = data[idx + 2] = intensity * 255;
      data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Add a circle outline
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
}

// Render wavefront to a specific canvas
function renderWavefrontToCanvas(canvas) {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  const resolution = 30; // Lower resolution for comparison views
  const state = window.aberrationState;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw wavefront phase
  const minDimension = Math.min(width, height);
  const cellSize = minDimension / resolution;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = minDimension / 2 * 0.9;
  
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      // Calculate position in unit circle
      const x = (i / (resolution - 1) - 0.5) * 2;
      const y = (j / (resolution - 1) - 0.5) * 2;
      
      // Calculate radius
      const r = Math.sqrt(x * x + y * y);
      
      // Skip if outside unit circle
      if (r > 1) continue;
      
      const theta = Math.atan2(y, x);
      
      // Calculate phase based on aberration type
      let phase = 0;
      
      switch (state.currentAberration) {
        case 'astigmatism-2fold':
          phase = state.currentAmplitude * r * r * Math.cos(2 * (theta - state.currentRotation * Math.PI / 180));
          break;
        case 'astigmatism-3fold':
          phase = state.currentAmplitude * r * r * r * Math.cos(3 * (theta - state.currentRotation * Math.PI / 180));
          break;
        case 'coma':
          phase = state.currentAmplitude * r * r * r * Math.cos(theta - state.currentRotation * Math.PI / 180);
          break;
        case 'spherical':
          phase = state.currentAmplitude * Math.pow(r, 4);
          break;
      }
      
      // Normalize phase to color
      const normalizedPhase = (phase + 1) / 2;
      
      // Create color gradient (blue to red)
      const r1 = Math.floor(normalizedPhase * 255);
      const g1 = 0;
      const b1 = Math.floor((1 - normalizedPhase) * 255);
      
      // Calculate screen position
      const screenX = centerX + x * radius;
      const screenY = centerY + y * radius;
      
      ctx.fillStyle = `rgb(${r1}, ${g1}, ${b1})`;
      ctx.fillRect(screenX - cellSize/2, screenY - cellSize/2, cellSize, cellSize);
    }
  }
  
  // Draw circle outline
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
}

// Update all comparison canvases
function updateCompareCanvases() {
  const canvases = [
    {canvas: document.getElementById('compare-astig2'), type: 'astigmatism-2fold'},
    {canvas: document.getElementById('compare-astig3'), type: 'astigmatism-3fold'},
    {canvas: document.getElementById('compare-coma'), type: 'coma'},
    {canvas: document.getElementById('compare-spherical'), type: 'spherical'}
  ];
  
  canvases.forEach(item => {
    if (item.canvas) {
      ensureCanvasDimensions(item.canvas);
      renderCompareView(item.canvas, item.canvas.id.replace('compare-', ''));
    }
  });
}
