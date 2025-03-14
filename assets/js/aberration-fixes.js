// Fix for aberration visualization issues
// This script fixes the 2D wavefront canvas and PSF canvas sizing and interaction

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing aberration visualization fixes');
  
  // Wait a bit for the original script to initialize
  setTimeout(function() {
    // Fix canvas dimensions
    fixCanvasDimensions();
    
    // Set up proper control listeners
    setupControlListeners();
    
    // Update all visualizations
    updateAllVisualizations();
  }, 300);
});

// Fix canvas dimensions to ensure proper rendering
function fixCanvasDimensions() {
  const canvases = [
    document.getElementById('wavefront-2d'),
    document.getElementById('psf-canvas'),
    document.getElementById('psf-3d'),
    document.getElementById('compare-astig2'),
    document.getElementById('compare-astig3'),
    document.getElementById('compare-coma'),
    document.getElementById('compare-spherical')
  ];
  
  canvases.forEach(canvas => {
    if (canvas) {
      // Get the parent container dimensions
      const container = canvas.parentElement;
      if (container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        // Set canvas dimensions to match container
        canvas.width = width;
        canvas.height = height;
        console.log(`Fixed canvas ${canvas.id} dimensions: ${width}x${height}`);
      }
    }
  });
}

// Set up control listeners to update all visualizations
function setupControlListeners() {
  // Link amplitude slider to all visualizations
  const amplitudeSlider = document.getElementById('amplitude-slider');
  if (amplitudeSlider) {
    amplitudeSlider.addEventListener('input', function() {
      window.currentAmplitude = this.value / 100;
      const amplitudeValue = document.getElementById('amplitude-value');
      if (amplitudeValue) {
        amplitudeValue.textContent = window.currentAmplitude.toFixed(1);
      }
      updateAllVisualizations();
    });
  }
  
  // Link rotation slider to all visualizations
  const rotationSlider = document.getElementById('rotation-slider');
  if (rotationSlider) {
    rotationSlider.addEventListener('input', function() {
      window.currentRotation = parseInt(this.value);
      const rotationValue = document.getElementById('rotation-value');
      if (rotationValue) {
        rotationValue.textContent = window.currentRotation + '°';
      }
      updateAllVisualizations();
    });
  }
  
  // Link aberration type buttons to all visualizations
  const aberrationButtons = document.querySelectorAll('.aberration-button');
  aberrationButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Get all aberration selectors on the page
      const selectors = document.querySelectorAll('.aberration-selector');
      
      // Update all selectors to ensure consistency
      selectors.forEach(selector => {
        selector.querySelectorAll('.aberration-button').forEach(btn => {
          btn.classList.remove('active');
        });
        
        const matchingButton = selector.querySelector(`[data-type="${this.getAttribute('data-type')}"]`);
        if (matchingButton) {
          matchingButton.classList.add('active');
        }
      });
      
      window.currentAberration = this.getAttribute('data-type');
      updateAllVisualizations();
    });
  });
  
  // Link PSF tab controls to maintain consistent state
  const psfAmplitudeSlider = document.getElementById('psf-amplitude-slider');
  if (psfAmplitudeSlider && amplitudeSlider) {
    // Sync the PSF slider with the main one
    psfAmplitudeSlider.value = amplitudeSlider.value;
    
    psfAmplitudeSlider.addEventListener('input', function() {
      window.currentAmplitude = this.value / 100;
      
      // Update both amplitude displays
      const psfAmplitudeValue = document.getElementById('psf-amplitude-value');
      const amplitudeValue = document.getElementById('amplitude-value');
      
      if (psfAmplitudeValue) {
        psfAmplitudeValue.textContent = window.currentAmplitude.toFixed(1);
      }
      
      if (amplitudeValue) {
        amplitudeValue.textContent = window.currentAmplitude.toFixed(1);
      }
      
      // Sync the main slider
      if (amplitudeSlider) {
        amplitudeSlider.value = this.value;
      }
      
      updateAllVisualizations();
    });
  }
  
  // Same for rotation
  const psfRotationSlider = document.getElementById('psf-rotation-slider');
  if (psfRotationSlider && rotationSlider) {
    // Sync the PSF slider with the main one
    psfRotationSlider.value = rotationSlider.value;
    
    psfRotationSlider.addEventListener('input', function() {
      window.currentRotation = parseInt(this.value);
      
      // Update both rotation displays
      const psfRotationValue = document.getElementById('psf-rotation-value');
      const rotationValue = document.getElementById('rotation-value');
      
      if (psfRotationValue) {
        psfRotationValue.textContent = window.currentRotation + '°';
      }
      
      if (rotationValue) {
        rotationValue.textContent = window.currentRotation + '°';
      }
      
      // Sync the main slider
      if (rotationSlider) {
        rotationSlider.value = this.value;
      }
      
      updateAllVisualizations();
    });
  }
}

// Update all visualizations
function updateAllVisualizations() {
  // Update 2D wavefront visualization
  updateWavefront2D();
  
  // Update PSF visualization
  updatePSF();
  
  // Update 3D PSF mesh
  updatePSF3DMesh();
  
  // Updates for comparison canvases would go here
  updateComparisonViews();
}

// Updated 2D wavefront visualization
function updateWavefront2D() {
  const canvas = document.getElementById('wavefront-2d');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Get current visualization parameters
  const currentAberration = window.currentAberration || 'astigmatism-2fold';
  const currentAmplitude = window.currentAmplitude || 0.5;
  const currentRotation = window.currentRotation || 0;
  const resolution = window.resolution || 40;
  const zoom = window.zoom || 100;
  
  // Draw wavefront phase
  const minDimension = Math.min(width, height);
  const cellSize = minDimension / resolution;
  const scale = zoom / 100;
  const centerX = width / 2;
  const centerY = height / 2;
  
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      // Calculate position in unit circle
      const x = (i / (resolution - 1) - 0.5) * 2 * scale;
      const y = (j / (resolution - 1) - 0.5) * 2 * scale;
      
      // Calculate radius
      const r = Math.sqrt(x * x + y * y);
      
      // Skip if outside unit circle
      if (r > 1) continue;
      
      const theta = Math.atan2(y, x);
      
      // Calculate phase based on aberration type
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
      const screenX = centerX + (x / scale) * (minDimension / 2);
      const screenY = centerY + (y / scale) * (minDimension / 2);
      
      ctx.fillStyle = `rgb(${r1}, ${g1}, ${b1})`;
      ctx.fillRect(screenX - cellSize/2, screenY - cellSize/2, cellSize, cellSize);
    }
  }
  
  // Draw circle outline
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, minDimension / 2 * (1 / scale), 0, Math.PI * 2);
  ctx.stroke();
}

// Update PSF visualization
function updatePSF() {
  const canvas = document.getElementById('psf-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Get current visualization parameters
  const currentAberration = window.currentAberration || 'astigmatism-2fold';
  const currentAmplitude = window.currentAmplitude || 0.5;
  const currentRotation = window.currentRotation || 0;
  
  // Create imageData for pixel manipulation
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calculate normalized coordinates from center
      const normX = (x - centerX) / radius;
      const normY = (y - centerY) / radius;
      
      // Calculate radial distance
      const r = Math.sqrt(normX * normX + normY * normY);
      
      // Skip if outside unit circle
      if (r > 1) continue;
      
      const theta = Math.atan2(normY, normX);
      
      // Calculate phase based on aberration type
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
      
      // Simplified PSF intensity calculation
      const intensity = Math.exp(-Math.pow(phase, 2) * 5);
      
      // Set pixel data
      const idx = (y * width + x) * 4;
      data[idx] = data[idx + 1] = data[idx + 2] = intensity * 255;
      data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// Update PSF 3D mesh
function updatePSF3DMesh() {
  if (!window.psf3D || !window.psf3D.mesh) return;
  
  const mesh = window.psf3D.mesh;
  if (!mesh.geometry || !mesh.geometry.attributes || !mesh.geometry.attributes.position) return;
  
  const vertices = mesh.geometry.attributes.position.array;
  const currentAberration = window.currentAberration || 'astigmatism-2fold';
  const currentAmplitude = window.currentAmplitude || 0.5;
  const currentRotation = window.currentRotation || 0;
  
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    
    // Convert to polar coordinates
    const r = Math.sqrt(x * x + y * y);
    let theta = Math.atan2(y, x);
    
    // Calculate phase based on aberration type
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
    vertices[i + 2] = intensity;
  }
  
  mesh.geometry.attributes.position.needsUpdate = true;
  mesh.geometry.computeVertexNormals();
}

// Update comparison views
function updateComparisonViews() {
  const compareCanvases = {
    'astigmatism-2fold': document.getElementById('compare-astig2'),
    'astigmatism-3fold': document.getElementById('compare-astig3'),
    'coma': document.getElementById('compare-coma'),
    'spherical': document.getElementById('compare-spherical')
  };
  
  // Save current settings
  const savedAberration = window.currentAberration;
  const savedAmplitude = window.currentAmplitude;
  const savedRotation = window.currentRotation;
  
  // Fixed amplitude for comparison
  const compareAmplitude = 0.7;
  
  // Render each comparison view
  for (const [aberrationType, canvas] of Object.entries(compareCanvases)) {
    if (!canvas) continue;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Temporarily set visualization parameters for this view
    window.currentAberration = aberrationType;
    window.currentAmplitude = compareAmplitude;
    
    // Set rotation for non-spherical aberrations
    if (aberrationType !== 'spherical') {
      window.currentRotation = 45; // Fixed rotation angle for comparison
    }
    
    // Check if we're showing PSF or wavefront
    const compareView = document.querySelector('[data-compare-view].active');
    const showPSF = compareView && compareView.getAttribute('data-compare-view') === 'psf';
    
    if (showPSF) {
      // Draw PSF
      renderPSFToCanvas(canvas);
    } else {
      // Draw wavefront
      renderWavefrontToCanvas(canvas);
    }
  }
  
  // Restore original settings
  window.currentAberration = savedAberration;
  window.currentAmplitude = savedAmplitude;
  window.currentRotation = savedRotation;
}

// Helper function to render wavefront to a specific canvas
function renderWavefrontToCanvas(canvas) {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  const resolution = 30; // Lower resolution for comparison views
  
  // Draw wavefront phase
  const minDimension = Math.min(width, height);
  const cellSize = minDimension / resolution;
  const centerX = width / 2;
  const centerY = height / 2;
  
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
      const screenX = centerX + x * (minDimension / 2);
      const screenY = centerY + y * (minDimension / 2);
      
      ctx.fillStyle = `rgb(${r1}, ${g1}, ${b1})`;
      ctx.fillRect(screenX - cellSize/2, screenY - cellSize/2, cellSize, cellSize);
    }
  }
  
  // Draw circle outline
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, minDimension / 2, 0, Math.PI * 2);
  ctx.stroke();
}

// Helper function to render PSF to a specific canvas
function renderPSFToCanvas(canvas) {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  
  // Create imageData for pixel manipulation
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calculate normalized coordinates from center
      const normX = (x - centerX) / radius;
      const normY = (y - centerY) / radius;
      
      // Calculate radial distance
      const r = Math.sqrt(normX * normX + normY * normY);
      
      // Skip if outside unit circle
      if (r > 1) continue;
      
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
}
