import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

from app.api.v1 import router as v1_router
from app.core.config import settings
from app.core.logging_config import configure_logging
from app.core.database import engine
from app.exceptions.base import AppException
from app.middleware.logging import AccessLogMiddleware
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.timing import TimingMiddleware

configure_logging()
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(AccessLogMiddleware)    # structured per-request log
app.add_middleware(TimingMiddleware)       # X-Process-Time-Ms header
app.add_middleware(RequestIDMiddleware)    # X-Request-ID header

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-Process-Time-Ms"],
)

# Exeption handlers
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "-")
    logger.warning(
        "domain_exception",
        extra={
            "request_id": request_id,
            "path": request.url.path,
            "error_message": exc.message,
            "status_code": exc.status_code,
        },
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "message": exc.message, "details": exc.details},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    logger.warning("validation_error", extra={"path": request.url.path, "errors": exc.errors()})
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": "Request validation failed.",
            "details": exc.errors(),
        },
    )


@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError) -> JSONResponse:
    logger.error("db_integrity_error", extra={"path": request.url.path, "error": str(exc.orig)})
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={
            "success": False,
            "message": "A database constraint was violated.",
            "details": None if settings.is_production else str(exc.orig),
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "-")
    logger.exception("unhandled_exception", extra={"request_id": request_id, "path": request.url.path})
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An unexpected internal error occurred.",
            "details": None if settings.is_production else str(exc),
        },
    )


app.include_router(v1_router, prefix=settings.API_V1_PREFIX)

@app.get("/api/health", tags=["Health"])
@app.get("/api/health/live", tags=["Health"])
def liveness():
    return {"success": True, "data": {"status": "live"}}


@app.get("/api/health/ready", tags=["Health"])
def readiness():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"success": True, "data": {"status": "ready", "db": "connected"}}
    except Exception as exc:
        logger.error("readiness_check_failed", extra={"error": str(exc)})
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"success": False, "data": {"status": "not_ready", "db": "unreachable"}},
        )


@app.get("/", tags=["Health"])
def root():
    return {
        "success": True,
        "data": {"service": settings.APP_NAME, "version": settings.APP_VERSION, "docs": "/api/docs"},
    }
