from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.constants import DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE
from app.core.database import get_db
from app.core.unit_of_work import UnitOfWork
from app.schemas.common import PaginatedResponse, SuccessResponse
from app.schemas.product import ProductCreate, ProductRead, ProductUpdate
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Products"])


def _svc(db: Session = Depends(get_db)) -> ProductService:
    return ProductService(UnitOfWork(session=db))


@router.get("", response_model=PaginatedResponse[ProductRead])
def list_products(
    q: str | None = Query(default=None, description="Search by name or SKU"),
    low_stock: bool = Query(default=False, description="Show only low-stock items"),
    min_price: float | None = Query(default=None, ge=0),
    max_price: float | None = Query(default=None, ge=0),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE),
    svc: ProductService = Depends(_svc),
):
    items, total = svc.list_products(
        q=q, low_stock=low_stock, min_price=min_price,
        max_price=max_price, page=page, limit=limit,
    )
    return PaginatedResponse.build(items=items, total=total, page=page, limit=limit)


@router.get("/{product_id}", response_model=SuccessResponse[ProductRead])
def get_product(product_id: int, svc: ProductService = Depends(_svc)):
    return SuccessResponse(data=svc.get_product(product_id))


@router.post("", response_model=SuccessResponse[ProductRead], status_code=201)
def create_product(payload: ProductCreate, svc: ProductService = Depends(_svc)):
    return SuccessResponse(data=svc.create_product(payload))


@router.put("/{product_id}", response_model=SuccessResponse[ProductRead])
def update_product(product_id: int, payload: ProductUpdate, svc: ProductService = Depends(_svc)):
    return SuccessResponse(data=svc.update_product(product_id, payload))


@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, svc: ProductService = Depends(_svc)):
    svc.delete_product(product_id)
    return None