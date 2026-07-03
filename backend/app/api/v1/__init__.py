from fastapi import APIRouter
from app.api.v1 import products, customers

router = APIROuter()
router.include_router(products.router)
router.include_router(customers.router)