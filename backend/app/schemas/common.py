import math
from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    details: str | None = None


class PaginatedResponse(BaseModel, Generic[T]):
    success: bool = True
    data: list[T]
    page: int
    limit: int
    total: int
    pages: int

    @classmethod
    def build(cls, items: list, total: int, page: int, limit: int) -> "PaginatedResponse":
        return cls(
            data=items, total=total, page=page, limit=limit,
            pages=math.ceil(total / limit) if limit else 1,
        )
