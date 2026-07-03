from app.exceptions.base import AppException

class CustomerNotFoundError(AppException):
    status_code = 404

class DuplicateEmailError(AppException):
    status_code = 409
