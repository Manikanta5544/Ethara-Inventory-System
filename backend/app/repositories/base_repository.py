# Base repository for CRUD operations. All other repositories inherit from this.
# Services call repositories; repositories never call services.

from typing import Generic, Type, TypeVar

from sqlalchemy.orm import Session

ModelType = TypeVar("ModelType")


class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], db: Session):
        self.model = model
        self.db = db

    def get(self, id: int) -> ModelType | None:
        return self.db.get(self.model, id)

    def list(self, skip: int = 0, limit: int = 100) -> list[ModelType]:
        return self.db.query(self.model).offset(skip).limit(limit).all()

    def add(self, instance: ModelType) -> ModelType:
        self.db.add(instance)
        self.db.flush()
        return instance

    def delete(self, instance: ModelType) -> None:
        self.db.delete(instance)
        self.db.flush()

    def count(self) -> int:
        return self.db.query(self.model).count()