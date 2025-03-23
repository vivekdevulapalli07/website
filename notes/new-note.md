---
layout: note
title: "Eigenvalues and PCA: A Quick Reference"
title: "New Note"
---

# Eigenvalues and Principal Component Analysis

This note provides a quick reference for eigenvalue calculation and Principal Component Analysis (PCA).

## Eigenvalues and Eigenvectors

An eigenvector of a square matrix $A$ is a non-zero vector $v$ such that when multiplied by $A$, the result is a scalar multiple of $v$:

$$
Av = \lambda v
$$

Where $\lambda$ is the eigenvalue associated with eigenvector $v$.

### Steps to Calculate Eigenvalues:

1. For a matrix $A$, form the characteristic equation: $\det(A - \lambda I) = 0$
2. Solve for $\lambda$ - these are the eigenvalues
3. For each eigenvalue, solve $(A - \lambda I)v = 0$ to find the eigenvectors

## Principal Component Analysis (PCA)

PCA is a dimensionality reduction technique that identifies the directions (principal components) along which the data varies the most.

### PCA Algorithm:

1. Standardize the dataset (mean = 0, standard deviation = 1)
2. Calculate the covariance matrix $\Sigma$
3. Calculate eigenvalues and eigenvectors of $\Sigma$
4. Sort eigenvectors by their eigenvalues in descending order
5. Select the top $k$ eigenvectors to form a projection matrix $W$
6. Transform the original dataset: $Y = X \times W$

### Implementation in Python:

```python
import numpy as np
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

# Assuming X is your data matrix
# Standardize the data
X_std = (X - np.mean(X, axis=0)) / np.std(X, axis=0)

# Calculate covariance matrix
cov_matrix = np.cov(X_std, rowvar=False)

# Calculate eigenvalues and eigenvectors
eigenvalues, eigenvectors = np.linalg.eig(cov_matrix)

# Sort eigenvectors by decreasing eigenvalues
idx = eigenvalues.argsort()[::-1]
eigenvalues = eigenvalues[idx]
eigenvectors = eigenvectors[:, idx]

# Choose first k eigenvectors
k = 2  # Example for 2D projection
W = eigenvectors[:, :k]

# Transform data
X_pca = X_std.dot(W)

# Alternatively, using scikit-learn:
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_std)

# New Note

Brief description of what this note covers.

## Key Points

- Point 1
- Point 2
- Point 3

## Details

Content goes here...

## Examples

```python
# Example code
print("Hello world")
```

## References

- Source 1
- Source 2
