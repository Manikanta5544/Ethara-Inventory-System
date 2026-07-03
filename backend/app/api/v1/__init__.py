from fastapi import APIRouter
from app.api.v1 import products, customers, orders, dashboard

router = APIROuter()
router.include_router(products.router)
router.include_router(customers.router)
router.include_router(orders.router)
router.include_router(dashboard.router)