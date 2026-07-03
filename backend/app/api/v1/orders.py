from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.constants import DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE
from app.core.database import get_db
from app.core.unit_of_work import UnitOfWork
from app.schemas.common import PaginatedResponse, SuccessResponse
from app.schemas.order import OrderCreate, OrderRead
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["Orders"])


def _svc(db: Session = Depends(get_db)) -> OrderService:
    return OrderService(UnitOfWork(session=db))


@router.get("", response_model=PaginatedResponse[OrderRead])
def list_orders(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE),
    svc: OrderService = Depends(_svc),
):
    items, total = svc.list_orders(page=page, limit=limit)
    return PaginatedResponse.build(items=items, total=total, page=page, limit=limit)


@router.get("/{order_id}", response_model=SuccessResponse[OrderRead])
def get_order(order_id: int, svc: OrderService = Depends(_svc)):
    return SuccessResponse(data=svc.get_order(order_id))


@router.post("", response_model=SuccessResponse[OrderRead], status_code=201)
def create_order(payload: OrderCreate, svc: OrderService = Depends(_svc)):
    return SuccessResponse(data=svc.create_order(payload))


@router.post("/{order_id}/cancel", response_model=SuccessResponse[OrderRead])
def cancel_order(order_id: int, svc: OrderService = Depends(_svc)):
    return SuccessResponse(data=svc.cancel_order(order_id))


@router.delete("/{order_id}", status_code=204)
def delete_order(order_id: int, svc: OrderService = Depends(_svc)):
    svc.delete_order(order_id)
    return None
