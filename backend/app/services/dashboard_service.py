from app.core.constants import LOW_STOCK_THRESHOLD
from app.core.unit_of_work import UnitOfWork
from app.schemas.dashboard import DashboardSummary


class DashboardService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def get_summary(self) -> DashboardSummary:
        return DashboardSummary(
            total_products=self.uow.products.count(),
            total_customers=self.uow.customers.count(),
            total_orders=self.uow.orders.count(),
            low_stock_count=self.uow.products.low_stock_count(LOW_STOCK_THRESHOLD),
            inventory_value=round(self.uow.products.inventory_value(), 2),
            average_order_value=self.uow.orders.average_order_value(),
            low_stock_threshold=LOW_STOCK_THRESHOLD,
        )