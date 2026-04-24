# Custom exceptions for the API
# makes error handling cleaner in the routes

class APIError(Exception):
    """base error class - other errors inherit from this"""
    def __init__(self, message, status_code=400, errors=None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.errors = errors or []


class NotFoundError(APIError):
    def __init__(self, message="Resource not found"):
        super().__init__(message, status_code=404)


class ValidationError(APIError):
    def __init__(self, message, errors=None):
        super().__init__(message, status_code=400, errors=errors)


class UnauthorizedError(APIError):
    def __init__(self, message="Unauthorized"):
        super().__init__(message, status_code=401)


class InsufficientStockError(APIError):
    """for when someone tries to sell more smocha ingredients than we have"""
    def __init__(self, available, requested):
        msg = f"Insufficient stock. Available: {available}, Requested: {requested}"
        super().__init__(msg, status_code=400)
