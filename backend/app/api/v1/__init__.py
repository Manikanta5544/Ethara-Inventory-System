from fastapi import APIRouter
from app.api.v1 import products

router = APIROuter()
router.include_router(products.router)