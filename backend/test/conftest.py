import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app


@pytest.fixture(scope="function")
def db_engine():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture(scope="function")
def db_session(db_engine):
    Session = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)
    session = Session()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="function")
def client(db_session):
    def _override():
        yield db_session

    app.dependency_overrides[get_db] = _override
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def make_product(client, name="Widget", sku="SKU-001", price=10.0, stock=50):
    r = client.post("/api/v1/products", json={
        "name": name, "sku": sku, "price": price, "stock_quantity": stock,
    })
    assert r.status_code == 201, r.text
    return r.json()["data"]


def make_customer(client, name="Alice", email="alice@example.com", phone="+1-555-0001"):
    r = client.post("/api/v1/customers", json={
        "name": name, "email": email, "phone": phone,
    })
    assert r.status_code == 201, r.text
    return r.json()["data"]


def make_order(client, customer_id, items):
    r = client.post("/api/v1/orders", json={
        "customer_id": customer_id, "items": items,
    })
    return r
