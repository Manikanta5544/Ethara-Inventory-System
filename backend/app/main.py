from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware

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

# app.include_router(v1_router, prefix=settings.API_V1_PREFIX)

@app.get("/", tags=["Health"])
def root():
    return {
        "success": True,
        "data": {"service": settings.APP_NAME, "version": settings.APP_VERSION, "docs": "/api/docs"},
    }
