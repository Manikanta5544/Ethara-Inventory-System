from app.exceptions.base import AppException

class InvalidOrderStateError(AppException):
    status_code = 409

class OrderItemLimitError(AppException):
    status_code = 422
