<div align="center">

# Ethara Inventory & Order Management System

*A production-ready full-stack inventory and order management platform built with FastAPI, React, PostgreSQL, Docker, and modern software engineering practices.*

<p align="center">

<img src="https://img.shields.io/badge/Python-3.12-blue?logo=python">
<img src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi">
<img src="https://img.shields.io/badge/React-19-61DAFB?logo=react">
<img src="https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql">
<img src="https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker">
<img src="https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions">
<img src="https://img.shields.io/badge/License-MIT-success">

</p>

### Live Application

**Frontend**

https://ethara-inventory-system-six.vercel.app/

**Backend API**

https://ethara-inventory-api-wi5a.onrender.com

**Swagger Documentation**

https://ethara-inventory-api-wi5a.onrender.com/api/docs

**Docker Hub**

https://hub.docker.com/repository/docker/mani54/ethara-inventory-backend/general

**GitHub Repository**

https://github.com/Manikanta5544/Ethara-Inventory-System

</div>

---

# Table of Contents

- Project Overview
- Features
- System Architecture
- Engineering Principles
- Technology Stack
- Project Structure

---

# Project Overview

Ethara Inventory & Order Management System is a production-oriented full-stack application designed to manage products, customers, inventory, and sales orders through a modern web interface backed by a RESTful API.

The application was developed with an emphasis on clean architecture, maintainability, and deployment readiness rather than simply satisfying CRUD requirements. Every layer of the application has a single responsibility, business rules are enforced on the server, and the complete system can be deployed using Docker or modern cloud platforms.

The backend is implemented with FastAPI using a layered architecture consisting of routers, services, repositories, and a Unit of Work pattern. SQLAlchemy 2.0 powers the persistence layer with Alembic migrations for version-controlled schema management.

The frontend is built using React and Vite, leveraging TanStack Query for asynchronous server state management, React Hook Form with Zod validation for forms, and Tailwind CSS for a responsive user interface.

The entire application is containerized using multi-stage Docker builds and orchestrated locally with Docker Compose. Continuous Integration is provided through GitHub Actions, while production deployments are hosted on Render (backend) and Vercel (frontend).

---

# Key Features

## Product Management

- Create products
- Update products
- Delete products
- Search and filter products
- Low stock filtering
- Unique SKU validation
- Inventory tracking
- Automatic inventory valuation

---

## Customer Management

- Customer registration
- Customer lookup
- Unique email validation
- Customer deletion
- Customer order relationships

---

## Order Management

- Create customer orders
- Multiple products per order
- Automatic order total calculation
- Inventory deduction
- Inventory restoration on cancellation
- Historical purchase price preservation
- Transaction-safe order creation

---

## Dashboard

Provides real-time business metrics including:

- Total products
- Total customers
- Total orders
- Low stock products
- Inventory valuation
- Average order value

---

## Production Features

Beyond the functional requirements, the project includes several engineering practices commonly used in production systems.

- Layered application architecture
- Repository Pattern
- Service Layer Pattern
- Unit of Work Pattern
- SQLAlchemy ORM
- Alembic database migrations
- Structured logging
- Global exception handling
- Request ID middleware
- Request timing middleware
- Health and readiness endpoints
- API versioning
- Environment-based configuration
- Docker Compose orchestration
- Multi-stage Docker builds
- GitHub Actions Continuous Integration
- Production-ready Nginx configuration
- Container health checks
- Typed request and response models
- Responsive frontend
- React Query caching
- Axios interceptors
- Zod schema validation

---

# System Architecture

```
                         Browser
                            │
                            ▼
                 React + Vite Frontend
                            │
                    TanStack Query
                            │
                     Axios API Client
                            │
────────────────────────────────────────────────────────
                   FastAPI REST API
────────────────────────────────────────────────────────
       Routers
           │
           ▼
      Service Layer
           │
           ▼
    Repository Layer
           │
           ▼
      Unit of Work
           │
           ▼
      SQLAlchemy ORM
           │
           ▼
      PostgreSQL Database
```

---

## Deployment Architecture

```
                 GitHub Repository
                        │
         ┌──────────────┴──────────────┐
         │                             │
         ▼                             ▼
   Vercel Deployment             Render Deployment
     (React Frontend)            (FastAPI Backend)
         │                             │
         └──────────────┬──────────────┘
                        ▼
                Render PostgreSQL
```

---

# Engineering Principles

The project intentionally separates responsibilities across distinct architectural layers to improve maintainability, testing, and long-term scalability.

---

## Thin API Layer

API routes are responsible only for:

- Request validation
- Dependency injection
- Returning HTTP responses

Business logic is never implemented inside route handlers.

---

## Service Layer

Application rules are implemented inside dedicated service classes.

Examples include:

- Stock validation
- Duplicate SKU validation
- Duplicate email validation
- Order total calculation
- Inventory updates
- Dashboard aggregation

Keeping business logic centralized avoids duplication and simplifies testing.

---

## Repository Pattern

Database access is isolated behind repository classes.

Benefits include:

- Separation of persistence from business logic
- Easier testing
- Cleaner service implementations
- Centralized query logic

---

## Unit of Work Pattern

All database operations execute inside a transactional boundary.

For example, creating an order performs the following operations atomically:

1. Validate customer
2. Validate products
3. Check inventory availability
4. Calculate totals
5. Deduct inventory
6. Create order
7. Create order items
8. Commit transaction

If any step fails, the transaction is rolled back automatically.

---

## Database Constraints

Critical business rules are enforced both at the application level and at the database level.

Examples include:

- Unique SKU
- Unique customer email
- Non-negative stock quantities
- Non-negative product pricing
- Foreign key integrity

This prevents invalid data regardless of the client consuming the API.

---

## Exception Handling

Domain-specific exceptions inherit from a common application exception.

Examples include:

- ProductNotFoundError
- CustomerNotFoundError
- DuplicateSKUError
- DuplicateEmailError
- InsufficientStockError

A global exception handler converts these exceptions into a consistent JSON response format, eliminating repetitive error handling throughout the application.

---

## API Response Standardization

Every endpoint returns a consistent response envelope.

Successful response

```json
{
  "success": true,
  "data": { }
}
```

Error response

```json
{
  "success": false,
  "message": "Human-readable error message",
  "details": null
}
```

This simplifies frontend integration while maintaining predictable API contracts.

---

# Technology Stack

## Backend

| Technology | Purpose |
|------------|----------|
| Python 3.12 | Application language |
| FastAPI | REST API framework |
| SQLAlchemy 2.0 | ORM |
| Alembic | Database migrations |
| PostgreSQL 16 | Relational database |
| Pydantic v2 | Request and response validation |
| Uvicorn | ASGI server |
| Pytest | Automated testing |

---

## Frontend

| Technology | Purpose |
|------------|----------|
| React 19 | User interface |
| Vite | Development server & build tool |
| React Router | Client-side routing |
| TanStack Query | Server state management |
| React Hook Form | Form management |
| Zod | Schema validation |
| Axios | HTTP client |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| React Hot Toast | Notifications |

---

## Infrastructure

| Technology | Purpose |
|------------|----------|
| Docker | Containerization |
| Docker Compose | Local orchestration |
| Nginx | Production frontend server |
| GitHub Actions | Continuous Integration |
| Render | Backend hosting |
| Vercel | Frontend hosting |
| Docker Hub | Image registry |

---

# Project Structure

```
Ethara-Inventory-System
│
├── backend
│   ├── alembic
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── exceptions
│   │   ├── middleware
│   │   ├── models
│   │   ├── repositories
│   │   ├── schemas
│   │   ├── services
│   │   └── main.py
│   │
│   ├── tests
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── features
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── lib
│   │   ├── pages
│   │   └── main.jsx
│   │
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
├── .github
│   └── workflows
│       └── ci.yml
│
└── README.md
```

---

The project structure intentionally follows a feature-oriented organization on the frontend and a layered architecture on the backend. This keeps related functionality grouped together while maintaining clear boundaries between business logic, persistence, and presentation layers.

---

# Database Design

The application uses PostgreSQL as the primary relational database. The schema is normalized to reduce redundancy while preserving referential integrity between products, customers, orders, and order items.

## Entity Relationship Diagram

```text
┌─────────────────────┐
│      Customers      │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email (UNIQUE)      │
│ phone               │
│ created_at          │
└──────────┬──────────┘
           │
           │ 1
           │
           │ N
┌──────────▼──────────┐
│       Orders        │
├─────────────────────┤
│ id (PK)             │
│ customer_id (FK)    │
│ total_amount        │
│ status              │
│ created_at          │
└──────────┬──────────┘
           │
           │ 1
           │
           │ N
┌──────────▼──────────┐
│    Order Items      │
├─────────────────────┤
│ id (PK)             │
│ order_id (FK)       │
│ product_id (FK)     │
│ quantity            │
│ price_at_purchase   │
└──────────┬──────────┘
           │
           │ N
           │
           │ 1
┌──────────▼──────────┐
│      Products       │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ sku (UNIQUE)        │
│ price               │
│ stock_quantity      │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

---

# Business Rules

The application enforces business rules at multiple layers including request validation, service logic, and database constraints.

## Product Rules

- Every product must have a unique SKU.
- Product prices cannot be negative.
- Stock quantities cannot be negative.
- Products can be updated without affecting historical orders.
- Search supports product name and SKU.
- Low-stock filtering is supported.

---

## Customer Rules

- Every customer email address must be unique.
- Email validation is performed before persistence.
- Customers cannot be duplicated.

---

## Order Rules

Order creation follows a transactional workflow.

For every incoming order:

1. Validate customer existence.
2. Validate every referenced product.
3. Verify available inventory.
4. Calculate order total on the server.
5. Store purchase price snapshot.
6. Deduct stock.
7. Persist order.
8. Persist order items.
9. Commit transaction.

If any step fails, the transaction is rolled back completely.

---

## Inventory Rules

Inventory is never modified directly by the frontend.

Only backend services may:

- Reduce stock
- Restore stock
- Validate inventory
- Calculate inventory valuation

This guarantees consistency regardless of client implementation.

---

## Error Handling

The API follows a consistent error format.

Example

```json
{
    "success": false,
    "message": "SKU 'IPHONE-001' already exists.",
    "details": null
}
```

Errors are generated through domain-specific exceptions and converted into HTTP responses by the global exception handler.

---

# REST API

All endpoints are versioned under

```
/api/v1
```

Interactive documentation is available at

```
https://ethara-inventory-api-wi5a.onrender.com/api/docs
```

---

# Product API

| Method | Endpoint | Description |
|----------|---------------------|--------------------------------|
| GET | `/products` | Retrieve products |
| GET | `/products/{id}` | Retrieve single product |
| POST | `/products` | Create product |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |

### Query Parameters

| Parameter | Description |
|------------|-----------------------------|
| q | Search by name or SKU |
| page | Pagination page |
| limit | Page size |
| low_stock | Only low-stock products |
| min_price | Minimum price |
| max_price | Maximum price |

---

# Customer API

| Method | Endpoint | Description |
|----------|-----------------------|----------------|
| GET | `/customers` | List customers |
| GET | `/customers/{id}` | Customer details |
| POST | `/customers` | Create customer |
| DELETE | `/customers/{id}` | Delete customer |

---

# Order API

| Method | Endpoint | Description |
|----------|------------------------|-----------------------------|
| GET | `/orders` | List orders |
| GET | `/orders/{id}` | Order details |
| POST | `/orders` | Create order |
| DELETE | `/orders/{id}` | Cancel/Delete order |

---

# Dashboard API

| Method | Endpoint | Description |
|----------|---------------------|---------------------------|
| GET | `/dashboard` | Business summary |

Returns:

- Total Products
- Total Customers
- Total Orders
- Low Stock Products
- Inventory Value
- Average Order Value

---

# Health Endpoints

Health endpoints are provided to support orchestration systems, Docker health checks, and cloud deployment readiness.

| Endpoint | Purpose |
|-----------------------|------------------------|
| `/api/health` | Application liveness |
| `/api/health/live` | Liveness probe |
| `/api/health/ready` | Database readiness |

---

# Running the Project

## Clone Repository

```bash
git clone https://github.com/Manikanta5544/Ethara-Inventory-System.git

cd Ethara-Inventory-System
```

---

# Running with Docker Compose (Recommended)

Docker Compose provisions:

- PostgreSQL
- FastAPI Backend
- React Frontend

Build and start all services

```bash
docker compose up --build
```

Access the application

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:8000
```

Swagger

```
http://localhost:8000/api/docs
```

Health

```
http://localhost:8000/api/health
```

Stop services

```bash
docker compose down
```

Remove containers and volumes

```bash
docker compose down -v
```

---

# Local Development

## Backend

Create virtual environment

```bash
cd backend

python -m venv .venv
```

Activate

Windows

```bash
.venv\Scripts\activate
```

Linux / macOS

```bash
source .venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Copy environment variables

```bash
cp .env.example .env
```

Run migrations

```bash
alembic upgrade head
```

Start development server

```bash
uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install
```

Create environment file

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Run

```bash
npm run dev
```

Production build

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# Environment Variables

## Backend

| Variable | Description |
|-----------|----------------------------------------|
| DATABASE_URL | PostgreSQL connection string |
| FRONTEND_URL | Allowed frontend origins |
| ENVIRONMENT | development / production |
| SECRET_KEY | Application secret |
| LOG_LEVEL | Logging level |

Example

```env
DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/inventory_db

FRONTEND_URL=http://localhost:5173

ENVIRONMENT=development

SECRET_KEY=change-this-secret

LOG_LEVEL=INFO
```

---

## Frontend

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Production example

```env
VITE_API_URL=https://ethara-inventory-api-wi5a.onrender.com/api/v1
```

---

# Docker Images

The project includes production-ready Docker configurations.

## Backend

- Multi-stage build
- Python 3.12 Slim
- Non-root execution
- Health checks
- Alembic migration on startup

---

## Frontend

- Multi-stage build
- Node.js build stage
- Nginx runtime
- SPA routing support
- Static asset caching
- Gzip compression

---

# Docker Compose Services

The application is orchestrated through Docker Compose using three containers.

| Service | Description |
|-----------|-------------------------|
| postgres | PostgreSQL database |
| backend | FastAPI API |
| frontend | React + Nginx |

Named Docker volumes are used for persistent PostgreSQL storage.

---

---

# Testing

The project includes automated backend tests covering core business functionality and frontend quality checks.

## Backend

Run the complete backend test suite

```bash
pytest
```

Run with coverage

```bash
pytest --cov=app --cov-report=term-missing
```

Current coverage threshold enforced in CI

```
70%
```

Tests cover

- Product CRUD
- Customer CRUD
- Order creation
- Inventory deduction
- Validation failures
- Duplicate SKU handling
- Duplicate email handling
- Insufficient inventory
- Dashboard endpoints
- Health endpoints
- Exception handling

---

## Frontend

Lint

```bash
npm run lint
```

Production build

```bash
npm run build
```

Preview build

```bash
npm run preview
```

---

# Continuous Integration

GitHub Actions automatically validates every push and pull request.

Pipeline includes

✅ Backend dependency installation

✅ Backend test execution

✅ Code coverage validation

✅ Frontend linting

✅ Production build verification

✅ Docker image build verification

Workflow location

```
.github/workflows/ci.yml
```

This ensures code quality before deployment.

---

# Deployment

The project is deployed using free cloud platforms while maintaining a production-style architecture.

## Frontend

Platform

Vercel

Deployment

```
https://ethara-inventory-system-six.vercel.app
```

---

## Backend

Platform

Render

Deployment

```
https://ethara-inventory-api-wi5a.onrender.com
```

---

## Database

Platform

Render PostgreSQL

Features

- Managed PostgreSQL
- Persistent storage
- Automatic backups
- SSL connection
- Connection pooling

---

# Deployment Flow

```
Developer

        │

        ▼

GitHub Repository

        │

        ├──────────────► GitHub Actions

        │                      │

        │                      ▼

        │              Test • Lint • Build

        │

        ▼

Render (Backend)

        │

        ▼

Render PostgreSQL

        ▲

        │

Vercel (Frontend)
```

---

# Logging

The backend implements structured logging throughout the application.

Request logging includes

- Request ID
- HTTP Method
- Endpoint
- Response Status
- Processing Time

Additional middleware

- Request ID Middleware
- Access Logging Middleware
- Response Timing Middleware

Example

```text
GET /api/v1/products

Status: 200

Duration: 32 ms

Request-ID:
```

Structured logs simplify production debugging and monitoring.

---

# Error Handling

The application uses centralized exception handling.

Exception categories include

- Domain exceptions
- Validation exceptions
- Database integrity violations
- Unexpected server errors

Example response

```json
{
    "success": false,
    "message": "SKU 'IPHONE-001' already exists.",
    "details": null
}
```

This provides predictable API behavior for frontend consumers.

---

# Validation

Validation occurs at multiple layers.

Frontend

- React Hook Form
- Zod schemas

Backend

- Pydantic models
- Service-level business validation
- SQLAlchemy constraints
- PostgreSQL constraints

This layered approach prevents invalid data from entering the system.

---

# Security Considerations

The application follows common production practices.

Implemented

✅ Environment variables

✅ Secrets excluded from Git

✅ CORS configuration

✅ SQLAlchemy ORM

✅ Input validation

✅ Transaction rollbacks

✅ Non-root Docker containers

✅ Health endpoints

✅ Structured logging

Future improvements

- JWT authentication
- RBAC
- Rate limiting
- HTTPS reverse proxy
- Audit logging
- Refresh tokens
- Redis caching

---

# Performance Considerations

Several optimizations were implemented.

Backend

- Repository Pattern
- Unit of Work Pattern
- Database indexing
- Pagination
- Server-side filtering
- Connection pooling
- Transaction batching

Frontend

- TanStack Query caching
- Axios interceptors
- Lazy data fetching
- React Hook Form
- Optimistic cache invalidation

Infrastructure

- Multi-stage Docker builds
- Nginx static serving
- Gzip compression
- Long-term asset caching
- Docker layer caching

---

# Production Engineering Decisions

Several design decisions were intentionally made to resemble a production application rather than a simple CRUD assignment.

## Repository Pattern

Business logic remains independent from persistence.

Benefits

- Easier testing
- Better maintainability
- Cleaner architecture

---

## Unit of Work Pattern

Database transactions are coordinated through a single abstraction.

Benefits

- Atomic operations
- Rollback support
- Cleaner service layer

---

## Alembic Migrations

Database schema is version-controlled.

Benefits

- Safe deployments
- Schema history
- Rollback capability

---

## React Query

Server state management is handled independently from UI state.

Benefits

- Automatic caching
- Background refetching
- Cache invalidation
- Reduced boilerplate

---

## Axios Interceptors

Common HTTP behavior is centralized.

Benefits

- Unified error handling
- Cleaner API layer
- Reduced duplication

---

## Docker

Separate production containers

- PostgreSQL
- Backend
- Frontend

Benefits

- Isolation
- Portability
- Consistent environments

---

## Nginx

Frontend production serving

Benefits

- SPA routing
- Asset caching
- Gzip compression
- Efficient static serving

---

# Future Enhancements

Potential improvements include

- Authentication & Authorization
- Role-based access control
- Barcode scanning
- Inventory history
- Purchase orders
- Supplier management
- Email notifications
- PDF invoice generation
- Redis caching
- Background jobs
- Kubernetes deployment
- Monitoring dashboards
- Prometheus & Grafana integration

---

# Author

**Kasani Manikanta**

Software Engineer | Full Stack Developer

LinkedIn

https://linkedin.com/in/kasani-manikanta

Email

kasanimanikanta6@gmail.com

GitHub

https://github.com/Manikanta5544

---

# Repository

GitHub

https://github.com/Manikanta5544/Ethara-Inventory-System

---

# Live Application

Frontend

https://ethara-inventory-system-six.vercel.app

Backend

https://ethara-inventory-api-wi5a.onrender.com

Swagger

https://ethara-inventory-api-wi5a.onrender.com/api/docs

Docker Hub

https://hub.docker.com/repository/docker/mani54/ethara-inventory-backend/general

---

# Submission Checklist

- ✅ React frontend
- ✅ FastAPI backend
- ✅ PostgreSQL database
- ✅ Dockerized backend
- ✅ Dockerized frontend
- ✅ Docker Compose setup
- ✅ Alembic migrations
- ✅ Repository Pattern
- ✅ Unit of Work Pattern
- ✅ RESTful API
- ✅ Validation
- ✅ Error handling
- ✅ Structured logging
- ✅ Health endpoints
- ✅ CI pipeline
- ✅ GitHub repository
- ✅ Docker Hub image
- ✅ Render deployment
- ✅ Vercel deployment
- ✅ Swagger documentation
- ✅ Production-ready README

---

## Final Notes

This project was developed as a production-oriented implementation of an Inventory & Order Management System. While the assessment focuses on CRUD functionality, the architecture emphasizes maintainability, scalability, and deployment readiness through clean layering, transaction management, automated testing, containerization, and continuous integration.

The goal was not only to satisfy the functional requirements but also to demonstrate engineering practices commonly used in real-world software development environments.