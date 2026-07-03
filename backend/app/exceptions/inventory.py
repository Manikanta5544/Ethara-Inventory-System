from app.exceptions.base import AppException

class InsufficientStockError(AppException):
    status_code = 422

class StockLevelError(AppException):
    status_code = 422
