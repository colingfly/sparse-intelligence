class SparseError(Exception):
    """Base exception for all Sparse Intelligence SDK errors."""
    pass


class SparseAPIError(SparseError):
    """Raised when the Sparse Intelligence API returns an error response."""

    def __init__(self, status_code: int, message: str, body: dict = None):
        self.status_code = status_code
        self.message = message
        self.body = body or {}
        super().__init__(f"[{status_code}] {message}")


class SparseConnectionError(SparseError):
    """Raised when the SDK cannot reach the Sparse Intelligence API."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)
