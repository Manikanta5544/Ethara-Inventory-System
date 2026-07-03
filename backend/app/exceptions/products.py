from app.exceptions.base import AppException

class ProductNotFoundError(AppException):
    status_code = 404

class DuplicateSKUError(AppException):
    status_code = 409
