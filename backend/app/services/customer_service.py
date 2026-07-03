import logging

from app.core.constants import DEFAULT_PAGE_SIZE
from app.core.unit_of_work import UnitOfWork
from app.exceptions.customers import CustomerNotFoundError, DuplicateEmailError
from app.exceptions.orders import InvalidOrderStateError
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate

logger = logging.getLogger(__name__)


class CustomerService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def list_customers(self, page=1, limit=DEFAULT_PAGE_SIZE):
        return self.uow.customers.paginated(skip=(page - 1) * limit, limit=limit)

    def get_customer(self, customer_id: int) -> Customer:
        customer = self.uow.customers.get(customer_id)
        if not customer:
            raise CustomerNotFoundError(f"Customer {customer_id} not found.")
        return customer

    def create_customer(self, payload: CustomerCreate) -> Customer:
        if self.uow.customers.get_by_email(payload.email):
            raise DuplicateEmailError(f"Email '{payload.email}' already exists.")
        customer = Customer(**payload.model_dump())
        self.uow.customers.add(customer)
        self.uow.commit()
        self.uow.session.refresh(customer)
        logger.info("customer_created", extra={"id": customer.id})
        return customer

    def delete_customer(self, customer_id: int) -> None:
        customer = self.get_customer(customer_id)
        if customer.orders:
            raise InvalidOrderStateError(
                "Cannot delete a customer with existing orders."
            )
        self.uow.customers.delete(customer)
        self.uow.commit()