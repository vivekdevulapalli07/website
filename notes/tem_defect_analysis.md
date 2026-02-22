---
layout: note
title: "Defect Analysis in TEM: A Practical Reference"
is_note: true
tags: [TEM, electron-microscopy, crystallography, defects, diffraction]
---

Characterizing crystalline defects — dislocations, grain boundaries, interfaces — is at the heart of TEM analysis for materials scientists. This note walks through the key concepts and practical steps, from determining crystal orientation to identifying Burgers vectors and interface planes.

> **Companion tool:** [pycotem](https://mompiou.github.io/pycotem/) is a free, open-source Python toolkit that implements all the workflows described here with graphical interfaces. Full paper: Mompiou & Xie, *J. Microsc.* 2021, [DOI: 10.1111/jmi.12982](https://doi.org/10.1111/jmi.12982).

---

## 1. Crystal Orientation: The Foundation

Everything in TEM defect analysis starts with knowing *how the crystal is oriented* relative to the microscope. This is described by a **rotation matrix** $\mathbf{R}$ that maps the crystal coordinate system (C) to the microscope coordinate system (M):

$$[\mathbf{x}, \mathbf{y}, \mathbf{z}]_M^T = \mathbf{R}\, [\mathbf{x}, \mathbf{y}, \mathbf{z}]_C^T$$

### Euler Angles (Bunge Convention)

The most common way to store orientation is as three **Euler angles** $(\varphi_1, \Phi, \varphi_2)$. Think of them as three successive rotations:

$$\mathbf{R} = \mathbf{R}_z(\varphi_1)\, \mathbf{R}_x(\Phi)\, \mathbf{R}_z(\varphi_2)$$

The rotation matrices are:

$$R_x(\theta) = \begin{pmatrix} 1 & 0 & 0 \\ 0 & \cos\theta & -\sin\theta \\ 0 & \sin\theta & \cos\theta \end{pmatrix}, \quad R_z(\theta) = \begin{pmatrix} \cos\theta & -\sin\theta & 0 \\ \sin\theta & \cos\theta & 0 \\ 0 & 0 & 1 \end{pmatrix}$$

> **In practice:** You rarely compute Euler angles by hand. The pycotem *diffraction* or *kikuchi* tools determine them from your experimental patterns automatically.

---

## 2. Electron Diffraction: Reading the Patterns

Diffraction patterns encode crystallographic information. There are two main types you encounter in TEM:

### Spot Patterns (Selected Area Diffraction, SAED)

Each spot corresponds to a set of lattice planes $(h, k, l)$ satisfying Bragg's law. The key quantity is the **diffraction vector** $\mathbf{g}$, defined as the vector from the transmitted beam to a diffraction spot in the pattern.

- The **d-spacing** of a reflection is read from how far the spot is from the centre: $d = \lambda L / r$ (where $L$ is the camera length and $r$ the spot distance in pixels/mm).
- A spot pattern always has at least 2-fold symmetry regardless of the crystal — this means a single zone-axis pattern can give a 180° orientation ambiguity. Use multiple patterns at different tilts to resolve it.

### Kikuchi Patterns

Kikuchi bands form when diffusely scattered electrons are re-diffracted. They appear as pairs of bright/dark lines crossing the pattern.

- Each Kikuchi band is perpendicular to the corresponding $\mathbf{g}$-vector.
- The **band width** is proportional to $1/d_{hkl}$.
- Kikuchi patterns are *much* more sensitive to exact crystal orientation than spot patterns — orientation accuracy can reach a few tenths of a degree.

### The Coordinate Transformation

When the specimen is tilted by $(\alpha, \beta)$, the diffraction vector measured in the projection plane must be corrected into the microscope frame:

$$[\mathbf{x}, \mathbf{y}, \mathbf{z}]_M = \mathbf{R}_x(-\beta)\, \mathbf{R}_y(-\alpha)\, \mathbf{R}_z(\xi)\, [\mathbf{x}, \mathbf{y}, \mathbf{z}]_P$$

where $\xi$ is the rotation between the tilt axis and the projection screen (a microscope-specific calibration constant). The inclination angle $\eta$ of a spot in the projection plane enters as:

$$[\mathbf{x}, \mathbf{y}, \mathbf{z}]_P = \mathbf{R}_z(-\eta)\, [0, 1, 0]_P^T$$

---

## 3. Determining Crystal Orientation

### From a Series of Spot Patterns

**Procedure:**
1. Vary the $\alpha$-tilt and record spot patterns whenever a bending contour crosses your area of interest (two-beam conditions work well).
2. For each pattern: measure the inclination angle $\eta$ of each diffraction spot and record the tilt angles $(\alpha, \beta)$.
3. Use d-spacing to identify the $(h, k, l)$ indices of each measured $\mathbf{g}$-vector.
4. Fit the orientation matrix using least-squares (Mackenzie's method): find $\mathbf{R}$ that minimises:

$$\langle\Delta\theta\rangle = \frac{1}{N} \sum_r \arccos\left( (\mathbf{x}_r, \mathbf{y}_r, \mathbf{z}_r)_M \cdot \mathbf{R}(\mathbf{D}^{-1})^T(h_r, k_r, l_r)_C^T \right)$$

Here $\mathbf{D}$ is the metric tensor of the crystal lattice (converts Miller indices into Cartesian coordinates).

**Accuracy:** With 4 or more $\mathbf{g}$-vectors and typical goniometer errors of 1–3°, expect orientation accuracy of ~1°.

### From a Kikuchi Pattern

1. Load the pattern image and identify at least two Kikuchi bands.
2. Define each band by three points (two on one edge, one on the other).
3. The band normal vector in the projection plane is: $[\mathbf{x}, \mathbf{y}, \mathbf{z}]_P = \mathbf{v}_p + [0, 0, \|\mathbf{v}_p\|^2 / L]$, where $L$ is the camera length.
4. Index the bands and solve for orientation — same least-squares approach as above.

**Accuracy:** Typically better than 0.5° because Kikuchi lines are more sensitive to exact orientation than spot positions.

---

## 4. Stereographic Projection

The stereographic projection is the essential navigation map for TEM crystallography.

### What it Shows

Each **point** on the projection represents a direction in the crystal (poles of planes, or zone axes). Great circles represent zones (planes sharing a common direction). It lets you answer questions like:
- "How far do I need to tilt to reach the [011] zone axis?"
- "Which $\mathbf{g}$-vectors will be in diffraction condition at this tilt?"

### Using it for TEM Navigation

Once you have the orientation matrix $\mathbf{R}$:
1. Plot the stereographic projection of your crystal at the current tilt $(\alpha, \beta)$.
2. A diffraction vector $\mathbf{g}$ is in the diffraction condition (Bragg-excited) when it lies on the equatorial great circle of the projection.
3. Read off the tilt needed to bring any desired $\mathbf{g}$ into diffraction condition — without ever turning the Wulff net by hand.

---

## 5. Burgers Vector Analysis

The Burgers vector **b** characterises a dislocation: it quantifies the magnitude and direction of the lattice distortion.

### The Invisibility Criterion

A dislocation becomes *invisible* (or nearly so) in a BF/DF image when:

$$\mathbf{g} \cdot \mathbf{b} = 0$$

This is the central working principle of Burgers vector analysis. In practice:
- Take BF images at **multiple** diffraction conditions (different $\mathbf{g}$-vectors).
- Identify which conditions make the dislocation disappear or show weak contrast.
- **b** must be perpendicular to every $\mathbf{g}$ that gives invisibility.

### Practical Procedure

1. Use the stereographic projection to plan which $\mathbf{g}$-vectors to use (choose them to span different directions).
2. Tilt to each diffraction condition and record BF (and/or weak-beam DF) images.
3. Note which conditions give strong vs. weak/no contrast.
4. The Burgers vector is at the intersection of all planes perpendicular to the invisibility $\mathbf{g}$-vectors (visible on the stereographic projection as the intersection of great circles).

### Example

For an FCC crystal, suppose you find invisibility at $\mathbf{g} = (200)$ and $\mathbf{g} = (111)$:
- $\mathbf{b}$ must satisfy $(200)\cdot\mathbf{b} = 0$ → $b_x = 0$
- $\mathbf{b}$ must satisfy $(111)\cdot\mathbf{b} = 0$ → $b_x + b_y + b_z = 0$

These two conditions point to $\mathbf{b} = \frac{a}{2}[0\bar{1}1]$, a perfect slip dislocation.

---

## 6. Interface and Slip Plane Determination

### The Trace Analysis Method

When a planar feature (grain boundary, slip plane, stacking fault) passes through the TEM foil, it leaves a **projected trace** on each image. At different tilt conditions, the trace direction $\mathbf{t}_p$ changes. From enough measurements, the true plane normal $\mathbf{n}$ can be extracted.

**Step 1: Find the trace direction.** Solve:

$$[\mathbf{b}_{e1} \times \mathbf{t}_{p1}, \ldots, \mathbf{b}_{em} \times \mathbf{t}_{pm}]^T \cdot \mathbf{t} = 0$$

where $\mathbf{b}_{ei}$ is the beam direction at tilt $i$ and $\mathbf{t}_{pi}$ is the measured trace direction in the image.

**Step 2: Find the plane normal.** Include the projected plane width $w_i$ (measured between the two surface traces):

$$w = \frac{|d\, \mathbf{n} \cdot \mathbf{b}_e|}{\sqrt{1 - (\mathbf{b}_e \cdot \mathbf{t})^2}}$$

Solving this system across multiple tilts gives $\mathbf{n}$ and the plane spacing $d$.

**Accuracy:** With 4–6 tilt conditions and careful measurements, the plane normal can be determined to within 1–2°.

### Slip Plane from Burgers Vector

If you know both the Burgers vector **b** and the dislocation line direction **l**, the slip plane normal is simply:

$$\mathbf{n}_s = \mathbf{b} \times \mathbf{l}$$

---

## 7. Practical Workflow Summary

The full workflow for analysing a dislocation near a grain boundary:

```
1. Record Kikuchi pattern → determine grain orientation (Euler angles)
2. Plot stereographic projection → plan tilt sequence
3. Tilt series: record BF images at 4–5 diffraction conditions
4. Apply g·b = 0 criterion → identify Burgers vector
5. Measure trace direction in BF images at multiple tilts
6. Solve for interface plane normal
7. Cross-check: compute n_s = b × l and compare to measured slip plane
```

**Key tip:** More data always wins. Adding one extra tilt condition costs 5 minutes but can drop your orientation/plane error from 3° to <1°.

---

## Accuracy Summary

| Task | Minimum inputs | Typical accuracy |
|------|---------------|-----------------|
| Orientation from spot patterns | 2 g-vectors | ~1–2° |
| Orientation from Kikuchi pattern | 2 bands | ~0.3–0.5° |
| Interface plane normal | 4 tilt conditions | ~1–2° |
| Dislocation line direction | 4 tilt conditions | ~0.3° |

---

## Software Tools

| Tool | Purpose | Access |
|------|---------|--------|
| **pycotem** | Full defect analysis workflow (orientation, Burgers vector, interface planes) | [GitHub](https://github.com/mompiou/pycotem) · [Docs](https://mompiou.github.io/pycotem/) |
| **CrysTBox** | Diffraction pattern indexing and simulation | [Website](http://crystbox.vscht.cz/) |
| **ALPHABETA** | Stage tilt angle calculation | [J. Microsc. 2019](https://doi.org/10.1111/jmi.12775) |
| **JEMS** | Electron microscopy simulation suite | [Website](http://www.jems-swiss.ch/) |

---

## References

- Mompiou F. & Xie R.-X. (2021). **pycotem: An open source toolbox for online crystal defect characterization from TEM imaging and diffraction.** *Journal of Microscopy*, 282, 84–97. [https://doi.org/10.1111/jmi.12982](https://doi.org/10.1111/jmi.12982)
- Williams D.B. & Carter C.B. (1996). *Transmission Electron Microscopy: A Textbook for Materials Science.* Springer. — The standard textbook; Chapter on indexing diffraction patterns is especially useful.
- Edington J.W. (1975). *Practical Electron Microscopy 2: Electron Diffraction in the Electron Microscope.* Macmillan. — Classic reference for diffraction geometry.
