from app.core.constants import MAX_ORDER_ITEMS
from app.exceptions.orders import InvalidOrderStateError, OrderItemLimitError
from app.models.order import Order, OrderStatus


class OrderDomain:
    @staticmethod
    def validate_item_limit(item_count: int) -> None:
        if item_count > MAX_ORDER_ITEMS:
            raise OrderItemLimitError(
                f"An order cannot exceed {MAX_ORDER_ITEMS} line items."
            )

    @staticmethod
    def assert_cancellable(order: Order) -> None:
        if order.status == OrderStatus.CANCELLED:
            raise InvalidOrderStateError(f"Order #{order.id} is already cancelled.")

    @staticmethod
    def assert_deletable(order: Order) -> None:
        pass  # no state restriction on deletion; reserved for future rules
