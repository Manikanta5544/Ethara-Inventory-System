import logging

from app.core.constants import DEFAULT_PAGE_SIZE, LOW_STOCK_THRESHOLD
from app.core.unit_of_work import UnitOfWork
from app.exceptions.products import DuplicateSKUError, ProductNotFoundError
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate

logger = logging.getLogger(__name__)


class ProductService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def list_products(self, q=None, low_stock=False, min_price=None,
                      max_price=None, page=1, limit=DEFAULT_PAGE_SIZE):
        skip = (page - 1) * limit
        return self.uow.products.search_and_filter(
            q=q, low_stock=low_stock, min_price=min_price, max_price=max_price,
            low_stock_threshold=LOW_STOCK_THRESHOLD, skip=skip, limit=limit,
        )

    def get_product(self, product_id: int) -> Product:
        product = self.uow.products.get(product_id)
        if not product:
            raise ProductNotFoundError(f"Product {product_id} not found.")
        return product

    def create_product(self, payload: ProductCreate) -> Product:
        if self.uow.products.get_by_sku(payload.sku):
            raise DuplicateSKUError(f"SKU '{payload.sku}' already exists.")
        product = Product(**payload.model_dump())
        self.uow.products.add(product)
        self.uow.commit()
        self.uow.session.refresh(product)
        logger.info("product_created", extra={"sku": product.sku, "id": product.id})
        return product

    def update_product(self, product_id: int, payload: ProductUpdate) -> Product:
        product = self.get_product(product_id)
        updates = payload.model_dump(exclude_unset=True)
        if "sku" in updates and updates["sku"] != product.sku:
            if self.uow.products.get_by_sku(updates["sku"]):
                raise DuplicateSKUError(f"SKU '{updates['sku']}' already exists.")
        for field, value in updates.items():
            setattr(product, field, value)
        self.uow.commit()
        self.uow.session.refresh(product)
        return product

    def delete_product(self, product_id: int) -> None:
        product = self.get_product(product_id)
        self.uow.products.delete(product)
        self.uow.commit()