import pytest
from tests.conftest import make_product


def test_create_product_success(client):
    p = make_product(client)
    assert p["id"] is not None
    assert p["sku"] == "SKU-001"
    assert p["stock_quantity"] == 50


def test_create_product_duplicate_sku_rejected(client):
    make_product(client, sku="DUPE-1")
    r = client.post("/api/v1/products", json={
        "name": "Other", "sku": "DUPE-1", "price": 5, "stock_quantity": 1,
    })
    assert r.status_code == 409
    assert r.json()["success"] is False


def test_get_product(client):
    p = make_product(client)
    r = client.get(f"/api/v1/products/{p['id']}")
    assert r.status_code == 200
    assert r.json()["data"]["sku"] == p["sku"]


def test_get_product_not_found(client):
    r = client.get("/api/v1/products/99999")
    assert r.status_code == 404


def test_update_product(client):
    p = make_product(client, price=10.0)
    r = client.put(f"/api/v1/products/{p['id']}", json={"price": 19.99})
    assert r.status_code == 200
    assert r.json()["data"]["price"] == 19.99


def test_update_product_sku_conflict(client):
    p1 = make_product(client, sku="A-001")
    p2 = make_product(client, sku="A-002", name="Other")
    r = client.put(f"/api/v1/products/{p2['id']}", json={"sku": "A-001"})
    assert r.status_code == 409


def test_delete_product(client):
    p = make_product(client)
    r = client.delete(f"/api/v1/products/{p['id']}")
    assert r.status_code == 204
    assert client.get(f"/api/v1/products/{p['id']}").status_code == 404


def test_negative_price_rejected(client):
    r = client.post("/api/v1/products", json={
        "name": "Bad", "sku": "BAD-1", "price": -1, "stock_quantity": 10,
    })
    assert r.status_code == 422


def test_negative_stock_rejected(client):
    r = client.post("/api/v1/products", json={
        "name": "Bad", "sku": "BAD-2", "price": 10, "stock_quantity": -5,
    })
    assert r.status_code == 422


def test_list_products_pagination(client):
    for i in range(5):
        make_product(client, sku=f"PG-{i:03d}", name=f"Product {i}")
    r = client.get("/api/v1/products?page=1&limit=3")
    body = r.json()
    assert r.status_code == 200
    assert body["success"] is True
    assert len(body["data"]) == 3
    assert body["total"] == 5
    assert body["pages"] == 2


def test_list_products_search(client):
    make_product(client, name="Wireless Mouse", sku="WM-001")
    make_product(client, name="Keyboard", sku="KB-002")
    r = client.get("/api/v1/products?q=wireless")
    assert r.status_code == 200
    assert len(r.json()["data"]) == 1
    assert r.json()["data"][0]["name"] == "Wireless Mouse"


def test_list_products_low_stock_filter(client):
    make_product(client, sku="LS-001", stock=3)
    make_product(client, sku="LS-002", stock=100)
    r = client.get("/api/v1/products?low_stock=true")
    assert r.status_code == 200
    data = r.json()["data"]
    assert all(p["stock_quantity"] <= 10 for p in data)
