from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.repositories.base_repository import BaseRepository


class CustomerRepository(BaseRepository[Customer]):
    def __init__(self, db: Session):
        super().__init__(Customer, db)

    def get_by_email(self, email: str) -> Customer | None:
        return self.db.scalar(select(Customer).where(Customer.email == email))

    def paginated(self, skip: int = 0, limit: int = 20) -> tuple[list[Customer], int]:
        total = self.count()
        items = list(
            self.db.scalars(select(Customer).order_by(Customer.id).offset(skip).limit(limit)).all()
        )
        return items, total
