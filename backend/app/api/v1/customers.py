from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.constants import DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE
from app.core.database import get_db
from app.core.unit_of_work import UnitOfWork
from app.schemas.common import PaginatedResponse, SuccessResponse
from app.schemas.customer import CustomerCreate, CustomerRead
from app.services.customer_service import CustomerService

router = APIRouter(prefix="/customers", tags=["Customers"])


def _svc(db: Session = Depends(get_db)) -> CustomerService:
    return CustomerService(UnitOfWork(session=db))


@router.get("", response_model=PaginatedResponse[CustomerRead])
def list_customers(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE),
    svc: CustomerService = Depends(_svc),
):
    items, total = svc.list_customers(page=page, limit=limit)
    return PaginatedResponse.build(items=items, total=total, page=page, limit=limit)


@router.get("/{customer_id}", response_model=SuccessResponse[CustomerRead])
def get_customer(customer_id: int, svc: CustomerService = Depends(_svc)):
    return SuccessResponse(data=svc.get_customer(customer_id))


@router.post("", response_model=SuccessResponse[CustomerRead], status_code=201)
def create_customer(payload: CustomerCreate, svc: CustomerService = Depends(_svc)):
    return SuccessResponse(data=svc.create_customer(payload))


@router.delete("/{customer_id}", status_code=204)
def delete_customer(customer_id: int, svc: CustomerService = Depends(_svc)):
    svc.delete_customer(customer_id)
    return None
