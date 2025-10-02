<div class="calculator">
    <h2>Grain Misorientation Calculator</h2>
    <p class="description">Calculate the misorientation angle between two grain orientations given in Euler angles (Bunge convention: φ₁, Φ, φ₂).</p>
    
    <div class="input-group">
        <label>Crystal System:</label>
        <select id="crystalSystemMiso" onchange="updateCrystalSymmetry()">
            <option value="cubic">Cubic</option>
            <option value="hexagonal">Hexagonal</option>
            <option value="tetragonal">Tetragonal</option>
            <option value="orthorhombic">Orthorhombic</option>
        </select>    
    </div>
    
    <div class="euler-inputs">
        <div class="grain-group">
            <h3>Grain 1 (Euler Angles in degrees)</h3>
            <div class="euler-row">
                <div class="euler-input">
                    <label>φ₁:</label>
                    <input type="number" id="phi1_g1" step="0.1" value="0" min="0" max="360">
                </div>
                <div class="euler-input">
                    <label>Φ:</label>
                    <input type="number" id="Phi_g1" step="0.1" value="0" min="0" max="180">
                </div>
                <div class="euler-input">
                    <label>φ₂:</label>
                    <input type="number" id="phi2_g1" step="0.1" value="0" min="0" max="360">
                </div>
            </div>
        </div>
        
        <div class="grain-group">
            <h3>Grain 2 (Euler Angles in degrees)</h3>
            <div class="euler-row">
                <div class="euler-input">
                    <label>φ₁:</label>
                    <input type="number" id="phi1_g2" step="0.1" value="45" min="0" max="360">
                </div>
                <div class="euler-input">
                    <label>Φ:</label>
                    <input type="number" id="Phi_g2" step="0.1" value="30" min="0" max="180">
                </div>
                <div class="euler-input">
                    <label>φ₂:</label>
                    <input type="number" id="phi2_g2" step="0.1" value="60" min="0" max="360">
                </div>
            </div>
        </div>
    </div>
    
    <button onclick="calculateMisorientation()">Calculate Misorientation</button>
    
    <div class="results" id="misorientationResults" style="display: none;">
        <h3>Results</h3>
        <div class="result-item">
            <strong>Misorientation Angle:</strong> <span id="misorientationAngle"></span>°
        </div>
        <div class="result-item">
            <strong>Rotation Axis:</strong> <span id="rotationAxis"></span>
        </div>
        <div class="result-item">
            <strong>Axis-Angle Representation:</strong> <span id="axisAngleRep"></span>
        </div>
        <div id="symmetryNote" class="info-note">
            Note: This calculation considers crystal symmetry operations for the selected crystal system.
        </div>
    </div>
    
    <div class="info-section">
        <h3>About Euler Angles (Bunge Convention)</h3>
        <p>The Bunge convention defines Euler angles as three consecutive rotations:</p>
        <ul>
            <li><strong>φ₁</strong>: Rotation about the Z-axis (0° to 360°)</li>
            <li><strong>Φ</strong>: Rotation about the new X-axis (0° to 180°)</li>
            <li><strong>φ₂</strong>: Rotation about the new Z-axis (0° to 360°)</li>
        </ul>
        
        <h3>Misorientation Calculation</h3>
        <p>The misorientation between two grains is calculated by:</p>
        <ol>
            <li>Converting Euler angles to orientation matrices (g₁ and g₂)</li>
            <li>Computing the misorientation matrix: Δg = g₁ · g₂⁻¹</li>
            <li>Applying crystal symmetry operations to find the minimum angle</li>
            <li>Extracting the misorientation angle and axis from the rotation matrix</li>
        </ol>
        
        <h3>Crystal Symmetry</h3>
        <p>Different crystal systems have different symmetry operations:</p>
        <ul>
            <li><strong>Cubic:</strong> 24 symmetry operations (Oh point group)</li>
            <li><strong>Hexagonal:</strong> 12 symmetry operations (D6h point group)</li>
            <li><strong>Tetragonal:</strong> 8 symmetry operations (D4h point group)</li>
            <li><strong>Orthorhombic:</strong> 4 symmetry operations (D2h point group)</li>
        </ul>
    </div>
</div>

<style>
.calculator {
    max-width: 900px;
    margin: 20px auto;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 15px rgba(0,0,0,0.1);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.description {
    color: #666;
    margin-bottom: 1.5rem;
    font-size: 1rem;
}

.input-group {
    margin-bottom: 20px;
}

.input-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
}

.euler-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin: 20px 0;
}

.grain-group {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #f8f9fa;
}

.grain-group h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
    font-size: 1.1rem;
}

.euler-row {
    display: flex;
    gap: 10px;
}

.euler-input {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.euler-input label {
    font-size: 0.9em;
    margin-bottom: 5px;
    color: #666;
}

input[type="number"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

select {
    width: 200px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    background: #0066cc;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    width: 100%;
    margin-top: 10px;
}

button:hover {
    background: #0052a3;
}

.results {
    margin-top: 30px;
    padding: 20px;
    background: #f0f8ff;
    border-radius: 8px;
    border-left: 4px solid #0066cc;
}

.results h3 {
    margin-top: 0;
    color: #0066cc;
}

.result-item {
    margin: 15px 0;
    font-size: 1.05rem;
}

.result-item strong {
    display: inline-block;
    min-width: 180px;
}

.info-note {
    margin-top: 15px;
    padding: 10px;
    background: #fff3cd;
    border-left: 4px solid #ffc107;
    border-radius: 4px;
    font-size: 0.9rem;
    color: #664d03;
}

.info-section {
    margin-top: 40px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}

.info-section h3 {
    color: #333;
    margin-top: 20px;
}

.info-section h3:first-child {
    margin-top: 0;
}

.info-section ul, .info-section ol {
    color: #555;
    line-height: 1.6;
}

@media (max-width: 768px) {
    .euler-inputs {
        grid-template-columns: 1fr;
    }
    
    .euler-row {
        flex-direction: column;
    }
}
</style>

<script>
// Matrix operations
function multiplyMatrices(m1, m2) {
    const result = Array(3).fill(0).map(() => Array(3).fill(0));
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                result[i][j] += m1[i][k] * m2[k][j];
            }
        }
    }
    return result;
}

function transposeMatrix(m) {
    return m[0].map((_, i) => m.map(row => row[i]));
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
}

// Convert Euler angles (Bunge convention) to orientation matrix
function eulerToMatrix(phi1, Phi, phi2) {
    // Convert to radians
    const phi1_rad = degreesToRadians(phi1);
    const Phi_rad = degreesToRadians(Phi);
    const phi2_rad = degreesToRadians(phi2);
    
    // Rotation matrices
    const cosPhi1 = Math.cos(phi1_rad);
    const sinPhi1 = Math.sin(phi1_rad);
    const cosPhi = Math.cos(Phi_rad);
    const sinPhi = Math.sin(Phi_rad);
    const cosPhi2 = Math.cos(phi2_rad);
    const sinPhi2 = Math.sin(phi2_rad);
    
    // Bunge convention: Z-X-Z rotation
    const g = [
        [
            cosPhi1 * cosPhi2 - sinPhi1 * sinPhi2 * cosPhi,
            sinPhi1 * cosPhi2 + cosPhi1 * sinPhi2 * cosPhi,
            sinPhi2 * sinPhi
        ],
        [
            -cosPhi1 * sinPhi2 - sinPhi1 * cosPhi2 * cosPhi,
            -sinPhi1 * sinPhi2 + cosPhi1 * cosPhi2 * cosPhi,
            cosPhi2 * sinPhi
        ],
        [
            sinPhi1 * sinPhi,
            -cosPhi1 * sinPhi,
            cosPhi
        ]
    ];
    
    return g;
}

// Get symmetry operators for different crystal systems
function getSymmetryOperators(crystalSystem) {
    const operators = [];
    
    if (crystalSystem === 'cubic') {
        // Cubic symmetry (24 operators)
        // Identity
        operators.push([[1,0,0],[0,1,0],[0,0,1]]);
        
        // 90° rotations around axes
        operators.push([[1,0,0],[0,0,-1],[0,1,0]]);  // 90° around X
        operators.push([[1,0,0],[0,-1,0],[0,0,-1]]); // 180° around X
        operators.push([[1,0,0],[0,0,1],[0,-1,0]]);  // 270° around X
        
        operators.push([[0,0,1],[0,1,0],[-1,0,0]]);  // 90° around Y
        operators.push([[-1,0,0],[0,1,0],[0,0,-1]]); // 180° around Y
        operators.push([[0,0,-1],[0,1,0],[1,0,0]]);  // 270° around Y
        
        operators.push([[0,-1,0],[1,0,0],[0,0,1]]);  // 90° around Z
        operators.push([[-1,0,0],[0,-1,0],[0,0,1]]); // 180° around Z
        operators.push([[0,1,0],[-1,0,0],[0,0,1]]);  // 270° around Z
        
        // 180° rotations around face diagonals
        operators.push([[0,1,0],[1,0,0],[0,0,-1]]);
        operators.push([[0,-1,0],[-1,0,0],[0,0,-1]]);
        operators.push([[0,0,-1],[0,1,0],[-1,0,0]]);
        operators.push([[0,0,1],[0,-1,0],[-1,0,0]]);
        operators.push([[-1,0,0],[0,0,1],[0,1,0]]);
        operators.push([[1,0,0],[0,0,-1],[0,1,0]]);
        
        // 120° rotations around body diagonals
        operators.push([[0,0,1],[1,0,0],[0,1,0]]);
        operators.push([[0,1,0],[0,0,1],[1,0,0]]);
        operators.push([[0,0,-1],[-1,0,0],[0,1,0]]);
        operators.push([[0,-1,0],[0,0,1],[-1,0,0]]);
        operators.push([[0,0,1],[-1,0,0],[0,-1,0]]);
        operators.push([[0,1,0],[0,0,-1],[-1,0,0]]);
        operators.push([[0,0,-1],[1,0,0],[0,-1,0]]);
        operators.push([[0,-1,0],[0,0,-1],[1,0,0]]);
        
    } else if (crystalSystem === 'hexagonal') {
        // Hexagonal symmetry (12 operators)
        operators.push([[1,0,0],[0,1,0],[0,0,1]]);  // Identity
        
        const cos60 = 0.5;
        const sin60 = Math.sqrt(3)/2;
        const cos120 = -0.5;
        const sin120 = Math.sqrt(3)/2;
        
        // Rotations around c-axis (Z)
        operators.push([[cos60,-sin60,0],[sin60,cos60,0],[0,0,1]]);   // 60°
        operators.push([[cos120,-sin120,0],[sin120,cos120,0],[0,0,1]]); // 120°
        operators.push([[-1,0,0],[0,-1,0],[0,0,1]]);                     // 180°
        operators.push([[cos120,sin120,0],[-sin120,cos120,0],[0,0,1]]); // 240°
        operators.push([[cos60,sin60,0],[-sin60,cos60,0],[0,0,1]]);     // 300°
        
        // 180° rotations perpendicular to c-axis
        operators.push([[1,0,0],[0,-1,0],[0,0,-1]]);
        operators.push([[cos60,-sin60,0],[sin60,-cos60,0],[0,0,-1]]);
        operators.push([[cos120,-sin120,0],[sin120,-cos120,0],[0,0,-1]]);
        operators.push([[-1,0,0],[0,1,0],[0,0,-1]]);
        operators.push([[cos120,sin120,0],[-sin120,-cos120,0],[0,0,-1]]);
        operators.push([[cos60,sin60,0],[-sin60,-cos60,0],[0,0,-1]]);
        
    } else if (crystalSystem === 'tetragonal') {
        // Tetragonal symmetry (8 operators)
        operators.push([[1,0,0],[0,1,0],[0,0,1]]);   // Identity
        operators.push([[0,-1,0],[1,0,0],[0,0,1]]);  // 90° around Z
        operators.push([[-1,0,0],[0,-1,0],[0,0,1]]); // 180° around Z
        operators.push([[0,1,0],[-1,0,0],[0,0,1]]);  // 270° around Z
        
        // 180° rotations perpendicular to c-axis
        operators.push([[1,0,0],[0,-1,0],[0,0,-1]]);
        operators.push([[0,1,0],[1,0,0],[0,0,-1]]);
        operators.push([[-1,0,0],[0,1,0],[0,0,-1]]);
        operators.push([[0,-1,0],[-1,0,0],[0,0,-1]]);
        
    } else if (crystalSystem === 'orthorhombic') {
        // Orthorhombic symmetry (4 operators)
        operators.push([[1,0,0],[0,1,0],[0,0,1]]);
        operators.push([[-1,0,0],[0,-1,0],[0,0,1]]);
        operators.push([[-1,0,0],[0,1,0],[0,0,-1]]);
        operators.push([[1,0,0],[0,-1,0],[0,0,-1]]);
    }
    
    return operators;
}

// Calculate misorientation angle from rotation matrix
function getRotationAngleAndAxis(R) {
    // Calculate trace
    const trace = R[0][0] + R[1][1] + R[2][2];
    
    // Calculate angle
    let angle = Math.acos((trace - 1) / 2);
    
    // Handle numerical errors
    if (isNaN(angle)) {
        if (trace >= 3) angle = 0;
        else if (trace <= -1) angle = Math.PI;
    }
    
    angle = radiansToDegrees(angle);
    
    // Calculate rotation axis
    let axis = [0, 0, 0];
    if (angle > 0.01 && angle < 179.99) {
        axis = [
            R[2][1] - R[1][2],
            R[0][2] - R[2][0],
            R[1][0] - R[0][1]
        ];
        
        // Normalize axis
        const magnitude = Math.sqrt(axis[0]**2 + axis[1]**2 + axis[2]**2);
        if (magnitude > 0) {
            axis = axis.map(x => x / magnitude);
        }
    } else if (angle < 0.01) {
        axis = [0, 0, 1]; // arbitrary for zero rotation
    } else {
        // 180° rotation - special case
        const maxDiag = Math.max(R[0][0], R[1][1], R[2][2]);
        if (R[0][0] === maxDiag) {
            axis[0] = Math.sqrt((R[0][0] + 1) / 2);
            axis[1] = R[0][1] / (2 * axis[0]);
            axis[2] = R[0][2] / (2 * axis[0]);
        } else if (R[1][1] === maxDiag) {
            axis[1] = Math.sqrt((R[1][1] + 1) / 2);
            axis[0] = R[0][1] / (2 * axis[1]);
            axis[2] = R[1][2] / (2 * axis[1]);
        } else {
            axis[2] = Math.sqrt((R[2][2] + 1) / 2);
            axis[0] = R[0][2] / (2 * axis[2]);
            axis[1] = R[1][2] / (2 * axis[2]);
        }
    }
    
    return { angle, axis };
}

function updateCrystalSymmetry() {
    // This can be used to update UI or provide additional info
    const system = document.getElementById('crystalSystemMiso').value;
    console.log('Crystal system changed to:', system);
}

function calculateMisorientation() {
    // Get Euler angles for both grains
    const phi1_g1 = parseFloat(document.getElementById('phi1_g1').value);
    const Phi_g1 = parseFloat(document.getElementById('Phi_g1').value);
    const phi2_g1 = parseFloat(document.getElementById('phi2_g1').value);
    
    const phi1_g2 = parseFloat(document.getElementById('phi1_g2').value);
    const Phi_g2 = parseFloat(document.getElementById('Phi_g2').value);
    const phi2_g2 = parseFloat(document.getElementById('phi2_g2').value);
    
    // Get crystal system
    const crystalSystem = document.getElementById('crystalSystemMiso').value;
    
    // Convert to orientation matrices
    const g1 = eulerToMatrix(phi1_g1, Phi_g1, phi2_g1);
    const g2 = eulerToMatrix(phi1_g2, Phi_g2, phi2_g2);
    
    // Calculate misorientation: Delta_g = g1 * g2^T
    const g2_T = transposeMatrix(g2);
    const delta_g = multiplyMatrices(g1, g2_T);
    
    // Get symmetry operators
    const symmetryOps = getSymmetryOperators(crystalSystem);
    
    // Find minimum misorientation considering symmetry
    let minAngle = 180;
    let minAxis = [0, 0, 0];
    let minRotation = delta_g;
    
    for (const S1 of symmetryOps) {
        for (const S2 of symmetryOps) {
            // Apply symmetry: S1 * delta_g * S2^T
            const S2_T = transposeMatrix(S2);
            const temp = multiplyMatrices(delta_g, S2_T);
            const symRotation = multiplyMatrices(S1, temp);
            
            const result = getRotationAngleAndAxis(symRotation);
            
            if (result.angle < minAngle) {
                minAngle = result.angle;
                minAxis = result.axis;
                minRotation = symRotation;
            }
        }
    }
    
    // Display results
    document.getElementById('misorientationResults').style.display = 'block';
    document.getElementById('misorientationAngle').textContent = minAngle.toFixed(2);
    document.getElementById('rotationAxis').textContent = 
        `[${minAxis[0].toFixed(3)}, ${minAxis[1].toFixed(3)}, ${minAxis[2].toFixed(3)}]`;
    document.getElementById('axisAngleRep').textContent = 
        `${minAngle.toFixed(2)}° about [${minAxis[0].toFixed(3)}, ${minAxis[1].toFixed(3)}, ${minAxis[2].toFixed(3)}]`;
    
    // Scroll to results
    document.getElementById('misorientationResults').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCrystalSymmetry();
});
</script>