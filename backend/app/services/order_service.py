import logging

from app.core.constants import DEFAULT_PAGE_SIZE
from app.core.unit_of_work import UnitOfWork
from app.domain.inventory import InventoryDomain
from app.domain.ordering import OrderDomain
from app.domain.pricing import PricingDomain
from app.exceptions.customers import CustomerNotFoundError
from app.exceptions.orders import InvalidOrderStateError
from app.exceptions.products import ProductNotFoundError
from app.models.order import Order, OrderStatus
from app.models.order_item import OrderItem
from app.schemas.order import OrderCreate

logger = logging.getLogger(__name__)


class OrderService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def list_orders(self, page=1, limit=DEFAULT_PAGE_SIZE):
        return self.uow.orders.paginated_with_details(skip=(page - 1) * limit, limit=limit)

    def get_order(self, order_id: int) -> Order:
        order = self.uow.orders.get_with_details(order_id)
        if not order:
            raise InvalidOrderStateError(f"Order {order_id} not found.")
        return order

    def create_order(self, payload: OrderCreate) -> Order:
        OrderDomain.validate_item_limit(len(payload.items))
        customer = self.uow.customers.get(payload.customer_id)
        if not customer:
            raise CustomerNotFoundError(f"Customer {payload.customer_id} not found.")
        try:
            order = Order(customer_id=payload.customer_id,
                          status=OrderStatus.PENDING, total_amount=0)
            self.uow.orders.add(order)
            line_totals = []
            for line in payload.items:
                product = self.uow.products.get_for_update(line.product_id)
                if not product:
                    raise ProductNotFoundError(f"Product {line.product_id} not found.")
                InventoryDomain.validate_stock(product, line.quantity)
                InventoryDomain.deduct_stock(product, line.quantity)
                line_totals.append(PricingDomain.line_total(product, line.quantity))
                self.uow.orders.add_item(OrderItem(
                    order_id=order.id, product_id=product.id,
                    quantity=line.quantity, price_at_purchase=product.price,
                ))
            order.total_amount = PricingDomain.order_total(line_totals)
            order.status = OrderStatus.COMPLETED
            self.uow.commit()
        except Exception:
            self.uow.rollback()
            raise
        logger.info("order_created", extra={"order_id": order.id, "total": str(order.total_amount)})
        return self.uow.orders.get_with_details(order.id)

    def cancel_order(self, order_id: int) -> Order:
        order = self.get_order(order_id)
        OrderDomain.assert_cancellable(order)
        for item in order.items:
            InventoryDomain.restore_stock(item.product, item.quantity)
        order.status = OrderStatus.CANCELLED
        self.uow.commit()
        return self.uow.orders.get_with_details(order_id)

    def delete_order(self, order_id: int) -> None:
        order = self.get_order(order_id)
        if order.status != OrderStatus.CANCELLED:
            for item in order.items:
                InventoryDomain.restore_stock(item.product, item.quantity)
        self.uow.orders.delete(order)
        self.uow.commit()