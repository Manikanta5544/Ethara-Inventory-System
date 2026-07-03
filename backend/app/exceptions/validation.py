from app.exceptions.base import AppException

class ValidationFailedError(AppException):
    status_code = 422
