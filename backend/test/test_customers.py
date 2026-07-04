from tests.conftest import make_customer, make_order, make_product


def test_create_customer_success(client):
    c = make_customer(client)
    assert c["id"] is not None
    assert c["email"] == "alice@example.com"


def test_create_customer_duplicate_email_rejected(client):
    make_customer(client, email="dup@example.com")
    r = client.post("/api/v1/customers", json={
        "name": "Bob", "email": "dup@example.com", "phone": "+1-555-0002",
    })
    assert r.status_code == 409
    assert r.json()["success"] is False


def test_get_customer(client):
    c = make_customer(client)
    r = client.get(f"/api/v1/customers/{c['id']}")
    assert r.status_code == 200
    assert r.json()["data"]["email"] == c["email"]


def test_get_customer_not_found(client):
    r = client.get("/api/v1/customers/99999")
    assert r.status_code == 404


def test_delete_customer(client):
    c = make_customer(client)
    r = client.delete(f"/api/v1/customers/{c['id']}")
    assert r.status_code == 204


def test_delete_customer_with_orders_blocked(client):
    p = make_product(client)
    c = make_customer(client)
    make_order(client, c["id"], [{"product_id": p["id"], "quantity": 1}])
    r = client.delete(f"/api/v1/customers/{c['id']}")
    assert r.status_code == 409


def test_list_customers_paginated(client):
    for i in range(4):
        make_customer(client, email=f"user{i}@example.com", name=f"User {i}")
    r = client.get("/api/v1/customers?page=1&limit=2")
    body = r.json()
    assert body["success"] is True
    assert len(body["data"]) == 2
    assert body["total"] == 4
    assert body["pages"] == 2
