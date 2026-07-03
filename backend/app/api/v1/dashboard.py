from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.unit_of_work import UnitOfWork
from app.schemas.common import SuccessResponse
from app.schemas.dashboard import DashboardSummary
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=SuccessResponse[DashboardSummary])
def get_dashboard(db: Session = Depends(get_db)):
    summary = DashboardService(UnitOfWork(session=db)).get_summary()
    return SuccessResponse(data=summary)