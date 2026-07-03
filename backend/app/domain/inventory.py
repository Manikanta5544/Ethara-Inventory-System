from app.exceptions.inventory import InsufficientStockError
from app.models.product import Product


class InventoryDomain:
    @staticmethod
    def validate_stock(product: Product, requested_qty: int) -> None:
        if product.stock_quantity < requested_qty:
            raise InsufficientStockError(
                f"Insufficient stock for '{product.name}' (SKU: {product.sku}). "
                f"Requested: {requested_qty}, Available: {product.stock_quantity}."
            )

    @staticmethod
    def deduct_stock(product: Product, qty: int) -> None:
        product.stock_quantity -= qty

    @staticmethod
    def restore_stock(product: Product, qty: int) -> None:
        product.stock_quantity += qty
