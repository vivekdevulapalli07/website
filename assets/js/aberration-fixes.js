// Fix for tab switching and PSF canvas issues
document.addEventListener('DOMContentLoaded', function() {
  console.log('Loading PSF and tab switching fixes');
  
  // Make sure global state variables exist
  window.currentAberration = window.currentAberration || 'astigmatism-2fold';
  window.currentAmplitude = window.currentAmplitude || 0.5;
  window.currentRotation = window.currentRotation || 0;
  window.resolution = window.resolution || 40;
  window.zoom = window.zoom || 100;
  
  // Properly set up tab button event listeners
  setupTabSwitching();
  
  // Fix PSF rendering
  fixPSFRendering();
  
  // Make sure the compare tab works
  fixCompareTab();
});

// Set up proper tab switching with canvas updates
function setupTabSwitching() {
  const tabButtons = document.querySelectorAll('.tab-button');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      console.log(`Switching to tab: ${tabId}`);
      
      // Update tab UI
      tabButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      
      this.classList.add('active');
      const targetPane = document.getElementById(`${tabId}-tab`);
      if (targetPane) {
        targetPane.classList.add('active');
        
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
        }
      }
    });
  });
}

// Initialize PSF canvases with proper dimensions
function initPSFCanvases() {
  const psfCanvas = document.getElementById('psf-canvas');
  const psf3dCanvas = document.getElementById('psf-3d');
  
  if (psfCanvas) {
    ensureCanvasDimensions(psfCanvas);
    console.log('PSF Canvas dimensions:', psfCanvas.width, psfCanvas.height);
  }
  
  if (psf3dCanvas) {
    ensureCanvasDimensions(psf3dCanvas);
    console.log('PSF 3D Canvas dimensions:', psf3dCanvas.width, psf3dCanvas.height);
    
    // Initialize 3D scene if needed
    if (!window.psf3D || !window.psf3D.scene) {
      initPSF3D(psf3dCanvas);
    }
  }
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
  
  // Set up view switcher in compare tab
  const viewButtons = document.querySelectorAll('[data-compare-view]');
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      viewButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Update all comparison canvases
      canvases.forEach(canvas => {
        if (canvas) {
          renderCompareView(canvas, canvas.id.replace('compare-', ''));
        }
      });
    });
  });
}

// Make sure canvas has appropriate dimensions
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

// Fix PSF rendering
function fixPSFRendering() {
  // Make sure PSF functions are defined
  window.updatePSF = function() {
    const canvas = document.getElementById('psf-canvas');
    if (!canvas) return;
    
    // Ensure canvas has dimensions
    ensureCanvasDimensions(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Create imageData for pixel manipulation
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
        
        switch (window.currentAberration) {
          case 'astigmatism-2fold':
            phase = window.currentAmplitude * r * r * Math.cos(2 * (theta - window.currentRotation * Math.PI / 180));
            break;
          case 'astigmatism-3fold':
            phase = window.currentAmplitude * r * r * r * Math.cos(3 * (theta - window.currentRotation * Math.PI / 180));
            break;
          case 'coma':
            phase = window.currentAmplitude * r * r * r * Math.cos(theta - window.currentRotation * Math.PI / 180);
            break;
          case 'spherical':
            phase = window.currentAmplitude * Math.pow(r, 4);
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
  };
  
  // Initialize 3D PSF visualization
  function initPSF3D(canvas) {
    if (!canvas) return;
    
    // Ensure THREE.js is available
    if (typeof THREE === 'undefined') {
      console.error('THREE.js not available');
      return;
    }
    
    // Initialize 3D PSF scene
    window.psf3D = {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000),
      renderer: new THREE.WebGLRenderer({ canvas: canvas, antialias: true }),
      controls: null,
      mesh: null
    };
    
    window.psf3D.renderer.setSize(canvas.width, canvas.height);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    window.psf3D.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    window.psf3D.scene.add(directionalLight);
    
    // Add orbit controls if available
    if (THREE.OrbitControls) {
      window.psf3D.controls = new THREE.OrbitControls(
        window.psf3D.camera, 
        window.psf3D.renderer.domElement
      );
    }
    
    // Position camera
    window.psf3D.camera.position.z = 5;
    
    // Create mesh
    createPSF3DMesh();
    
    // Start animation loop
    animatePSF3D();
  }
  
  // Create 3D PSF mesh
  function createPSF3DMesh() {
    if (!window.psf3D || !window.psf3D.scene) return;
    
    // Remove existing mesh if any
    if (window.psf3D.mesh) {
      window.psf3D.scene.remove(window.psf3D.mesh);
      window.psf3D.mesh.geometry.dispose();
      window.psf3D.mesh.material.dispose();
    }
    
    const resolution = window.resolution || 40;
    
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
    window.psf3D.mesh = new THREE.Mesh(geometry, material);
    window.psf3D.scene.add(window.psf3D.mesh);
  }
  
  // Update PSF 3D mesh vertices
  function updatePSF3DMeshVertices(geometry) {
    if (!geometry) return;
    
    const vertices = geometry.attributes.position.array;
    
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      
      // Convert to polar coordinates
      const r = Math.sqrt(x * x + y * y);
      const theta = Math.atan2(y, x);
      
      // Calculate phase based on aberration type
      let phase = 0;
      
      switch (window.currentAberration) {
        case 'astigmatism-2fold':
          phase = window.currentAmplitude * r * r * Math.cos(2 * (theta - window.currentRotation * Math.PI / 180));
          break;
        case 'astigmatism-3fold':
          phase = window.currentAmplitude * r * r * r * Math.cos(3 * (theta - window.currentRotation * Math.PI / 180));
          break;
        case 'coma':
          phase = window.currentAmplitude * r * r * r * Math.cos(theta - window.currentRotation * Math.PI / 180);
          break;
        case 'spherical':
          phase = window.currentAmplitude * Math.pow(r, 4);
          break;
      }
      
      // Simplified PSF intensity
      const intensity = Math.exp(-Math.pow(phase, 2) * 5);
      vertices[i + 2] = intensity * 2; // Scale for visibility
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
  }
  
  // Update 3D PSF
  function updatePSF3D() {
    if (!window.psf3D || !window.psf3D.mesh) return;
    
    // Update mesh vertices
    updatePSF3DMeshVertices(window.psf3D.mesh.geometry);
  }
  
  // Animation loop for 3D PSF
  function animatePSF3D() {
    if (!window.psf3D) return;
    
    requestAnimationFrame(animatePSF3D);
    
    if (window.psf3D.controls) {
      window.psf3D.controls.update();
    }
    
    if (window.psf3D.renderer && window.psf3D.scene && window.psf3D.camera) {
      window.psf3D.renderer.render(window.psf3D.scene, window.psf3D.camera);
    }
  }
  
  // Make sure the main aberration controls affect the PSF tab
  connectControlsToPSF();
}

// Connect main controls to PSF tab
function connectControlsToPSF() {
  // Amplitude sliders
  const amplitudeSlider = document.getElementById('amplitude-slider');
  const psfAmplitudeSlider = document.getElementById('psf-amplitude-slider');
  
  if (amplitudeSlider && psfAmplitudeSlider) {
    // Sync initial values
    psfAmplitudeSlider.value = amplitudeSlider.value;
    
    amplitudeSlider.addEventListener('input', function() {
      window.currentAmplitude = parseInt(this.value) / 100;
      if (psfAmplitudeSlider) {
        psfAmplitudeSlider.value = this.value;
      }
      updatePSF();
    });
    
    psfAmplitudeSlider.addEventListener('input', function() {
      window.currentAmplitude = parseInt(this.value) / 100;
      if (amplitudeSlider) {
        amplitudeSlider.value = this.value;
      }
      updatePSF();
      
      // Update amplitude value displays
      const psfAmplitudeValue = document.getElementById('psf-amplitude-value');
      const amplitudeValue = document.getElementById('amplitude-value');
      
      if (psfAmplitudeValue) {
        psfAmplitudeValue.textContent = window.currentAmplitude.toFixed(1);
      }
      
      if (amplitudeValue) {
        amplitudeValue.textContent = window.currentAmplitude.toFixed(1);
      }
    });
  }
  
  // Rotation sliders
  const rotationSlider = document.getElementById('rotation-slider');
  const psfRotationSlider = document.getElementById('psf-rotation-slider');
  
  if (rotationSlider && psfRotationSlider) {
    // Sync initial values
    psfRotationSlider.value = rotationSlider.value;
    
    rotationSlider.addEventListener('input', function() {
      window.currentRotation = parseInt(this.value);
      if (psfRotationSlider) {
        psfRotationSlider.value = this.value;
      }
      updatePSF();
    });
    
    psfRotationSlider.addEventListener('input', function() {
      window.currentRotation = parseInt(this.value);
      if (rotationSlider) {
        rotationSlider.value = this.value;
      }
      updatePSF();
      
      // Update rotation value displays
      const psfRotationValue = document.getElementById('psf-rotation-value');
      const rotationValue = document.getElementById('rotation-value');
      
      if (psfRotationValue) {
        psfRotationValue.textContent = window.currentRotation + '°';
      }
      
      if (rotationValue) {
        rotationValue.textContent = window.currentRotation + '°';
      }
    });
  }
  
  // Aberration buttons
  const aberrationButtons = document.querySelectorAll('.aberration-button');
  aberrationButtons.forEach(button => {
    button.addEventListener('click', function() {
      const aberrationType = this.getAttribute('data-type');
      if (!aberrationType) return;
      
      window.currentAberration = aberrationType;
      
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
      updatePSF();
    });
  });
}

// Fix compare tab rendering
function fixCompareTab() {
  // Handle view switching in compare tab
  const viewButtons = document.querySelectorAll('[data-compare-view]');
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      viewButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Update all comparison canvases
      updateCompareCanvases();
    });
  });
  
  // Handle amplitude slider in compare tab
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
  const savedAberration = window.currentAberration;
  const savedAmplitude = window.currentAmplitude;
  const savedRotation = window.currentRotation;
  
  // Set temporary state for this render
  window.currentAberration = aberrationType;
  window.currentAmplitude = amplitude;
  window.currentRotation = aberrationType === 'spherical' ? 0 : 45; // Fixed rotation for comparison
  
  // Render appropriate visualization
  if (showPSF) {
    renderPSFToCanvas(canvas);
  } else {
    renderWavefrontToCanvas(canvas);
  }
  
  // Restore state
  window.currentAberration = savedAberration;
  window.currentAmplitude = savedAmplitude;
  window.currentRotation = savedRotation;
}

// Render PSF to a specific canvas
function renderPSFToCanvas(canvas) {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  
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
      
      switch (window.currentAberration) {
        case 'astigmatism-2fold':
          phase = window.currentAmplitude * r * r * Math.cos(2 * (theta - window.currentRotation * Math.PI / 180));
          break;
        case 'astigmatism-3fold':
          phase = window.currentAmplitude * r * r * r * Math.cos(3 * (theta - window.currentRotation * Math.PI / 180));
          break;
        case 'coma':
          phase = window.currentAmplitude * r * r * r * Math.cos(theta - window.currentRotation * Math.PI / 180);
          break;
        case 'spherical':
          phase = window.currentAmplitude * Math.pow(r, 4);
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
      
      switch (window.currentAberration) {
        case 'astigmatism-2fold':
          phase = window.currentAmplitude * r * r * Math.cos(2 * (theta - window.currentRotation * Math.PI / 180));
          break;
        case 'astigmatism-3fold':
          phase = window.currentAmplitude * r * r * r * Math.cos(3 * (theta - window.currentRotation * Math.PI / 180));
          break;
        case 'coma':
          phase = window.currentAmplitude * r * r * r * Math.cos(theta - window.currentRotation * Math.PI / 180);
          break;
        case 'spherical':
          phase = window.currentAmplitude * Math.pow(r, 4);
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
      
      // Get current display mode
      const showPSF = document.querySelector('[data-compare-view="psf"].active') !== null;
      
      // Get amplitude for comparison
      const compareAmplitudeSlider = document.getElementById('compare-amplitude-slider');
      const amplitude = compareAmplitudeSlider ? parseInt(compareAmplitudeSlider.value) / 100 : 0.7;
      
      // Save current state
      const savedAberration = window.currentAberration;
      const savedAmplitude = window.currentAmplitude;
      const savedRotation = window.currentRotation;
      
      // Set temporary state for this render
      window.currentAberration = item.type;
      window.currentAmplitude = amplitude;
      window.currentRotation = item.type === 'spherical' ? 0 : 45; // Fixed rotation for comparison
      
      // Render appropriate visualization
      if (showPSF) {
        renderPSFToCanvas(item.canvas);
      } else {
        renderWavefrontToCanvas(item.canvas);
      }
      
      // Restore state
      window.currentAberration = savedAberration;
      window.currentAmplitude = savedAmplitude;
      window.currentRotation = savedRotation;
    }
  });
}
