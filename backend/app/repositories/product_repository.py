from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.product import Product
from app.repositories.base_repository import BaseRepository


class ProductRepository(BaseRepository[Product]):
    def __init__(self, db: Session):
        super().__init__(Product, db)

    def get_by_sku(self, sku: str) -> Product | None:
        return self.db.scalar(select(Product).where(Product.sku == sku))

    def search_and_filter(
        self,
        q: str | None = None,
        low_stock: bool = False,
        min_price: float | None = None,
        max_price: float | None = None,
        low_stock_threshold: int = 10,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Product], int]:
        query = select(Product)
        if q:
            like = f"%{q}%"
            query = query.where((Product.name.ilike(like)) | (Product.sku.ilike(like)))
        if low_stock:
            query = query.where(Product.stock_quantity <= low_stock_threshold)
        if min_price is not None:
            query = query.where(Product.price >= min_price)
        if max_price is not None:
            query = query.where(Product.price <= max_price)
        total = self.db.scalar(select(func.count()).select_from(query.subquery())) or 0
        items = list(self.db.scalars(query.order_by(Product.id).offset(skip).limit(limit)).all())
        return items, total

    def low_stock_count(self, threshold: int) -> int:
        return self.db.scalar(
            select(func.count()).select_from(Product).where(Product.stock_quantity <= threshold)
        ) or 0

    def inventory_value(self) -> float:
        return float(self.db.scalar(select(func.sum(Product.stock_quantity * Product.price))) or 0)

    def get_for_update(self, product_id: int) -> Product | None:
        return self.db.scalar(
            select(Product).where(Product.id == product_id).with_for_update()
        )
