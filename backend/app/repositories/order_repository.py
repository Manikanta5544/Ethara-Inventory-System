from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.order import Order
from app.models.order_item import OrderItem
from app.repositories.base_repository import BaseRepository


class OrderRepository(BaseRepository[Order]):
    def __init__(self, db: Session):
        super().__init__(Order, db)

    def get_with_details(self, order_id: int) -> Order | None:
        return self.db.scalar(
            select(Order)
            .options(
                joinedload(Order.customer),
                joinedload(Order.items).joinedload(OrderItem.product),
            )
            .where(Order.id == order_id)
        )

    def paginated_with_details(self, skip: int = 0, limit: int = 20) -> tuple[list[Order], int]:
        total = self.count()
        items = list(
            self.db.scalars(
                select(Order)
                .options(
                    joinedload(Order.customer),
                    joinedload(Order.items).joinedload(OrderItem.product),
                )
                .order_by(Order.id.desc())
                .offset(skip)
                .limit(limit)
            ).unique().all()
        )
        return items, total

    def average_order_value(self) -> float:
        from sqlalchemy import func
        value = self.db.scalar(select(func.avg(Order.total_amount)))
        return round(float(value or 0), 2)

    def add_item(self, item: OrderItem) -> OrderItem:
        self.db.add(item)
        self.db.flush()
        return item
