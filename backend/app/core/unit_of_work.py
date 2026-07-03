# Unit of Work pattern implementation for SQLAlchemy.

import logging

from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.repositories.product_repository import ProductRepository

logger = logging.getLogger(__name__)


class UnitOfWork:
    def __init__(self, session: Session | None = None):
        self._external_session = session is not None
        self.session: Session = session or SessionLocal()
        # Repos initialised immediately so callers can use UoW without `with`
        self.products  = ProductRepository(self.session)

    def __enter__(self) -> "UnitOfWork":
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        if exc_type:
            self.rollback()
        if not self._external_session:
            self.session.close()

    def commit(self) -> None:
        self.session.commit()

    def rollback(self) -> None:
        self.session.rollback()
        logger.warning("UoW rolled back")