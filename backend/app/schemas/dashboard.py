from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    low_stock_count: int
    inventory_value: float
    average_order_value: float
    low_stock_threshold: int