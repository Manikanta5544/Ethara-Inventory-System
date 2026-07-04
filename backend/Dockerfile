# Virtual environment build stage
FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /build

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
        libpq-dev && \
    rm -rf /var/lib/apt/lists/*

RUN python -m venv /opt/venv

ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install -r requirements.txt


# Runtime image stage
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Runtime packages only
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libpq5 \
        curl && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd --system app && \
    useradd --system \
            --gid app \
            --home /app \
            --shell /usr/sbin/nologin \
            app

# Copy virtual environment
COPY --from=builder /opt/venv /opt/venv

# Copy application
COPY . .

# Correct ownership
RUN chown -R app:app /app

USER app

EXPOSE 8000

# Health check (checks both API and DB readiness)
HEALTHCHECK \
    --interval=30s \
    --timeout=5s \
    --start-period=20s \
    --retries=3 \
    CMD curl --fail http://localhost:8000/api/health/ready || exit 1

CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]