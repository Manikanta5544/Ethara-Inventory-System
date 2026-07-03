from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.models.order import OrderStatus
from app.schemas.customer import CustomerRead
from app.schemas.product import ProductRead


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    product_id: int
    quantity: int
    price_at_purchase: float
    product: ProductRead | None = None


class OrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    customer_id: int
    total_amount: float
    status: OrderStatus
    created_at: datetime
    customer: CustomerRead | None = None
    items: list[OrderItemRead] = []
