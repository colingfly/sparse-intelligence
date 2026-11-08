"""
softmax/app.py -- Softmax.pro application entry point.

This is how softmax.pro uses the Sparse Intelligence package. It's just a Sparse Intelligence app
with specific configuration for the hosted platform.

Usage:
    python -m softmax.app
"""
from sparse_intelligence import SparseClient

app = Sparse(
    enable_game=True,
    enable_marketplace=True,
)

if __name__ == "__main__":
    app.serve(host="0.0.0.0", port=8000)
