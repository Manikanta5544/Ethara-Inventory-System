from app.exceptions.base import AppException

class ProductNotFoundError(AppException):
    status_code = 404
    def __init__(self, product_id: int):
        super().__init__(
            message=f"Product with ID '{product_id}' was not found."
        )

class DuplicateSKUError(AppException):
    status_code = 409
    def __init__(self, sku: str):
        super().__init__(
            message=f'A product with SKU "{sku}" already exists.'
        )
