from tests.conftest import make_customer, make_order, make_product


def _stock(client, product_id: int) -> int:
    return client.get(f"/api/v1/products/{product_id}").json()["data"]["stock_quantity"]


def test_create_order_deducts_stock_and_computes_total(client):
    p = make_product(client, price=20.0, stock=10)
    c = make_customer(client)

    r = make_order(client, c["id"], [{"product_id": p["id"], "quantity": 3}])
    assert r.status_code == 201
    order = r.json()["data"]
    assert order["total_amount"] == 60.0
    assert order["status"] == "COMPLETED"
    assert _stock(client, p["id"]) == 7


def test_order_price_at_purchase_snapshot(client):
    """Changing product price after order must not alter historical amount."""
    p = make_product(client, price=50.0, stock=10)
    c = make_customer(client)
    r = make_order(client, c["id"], [{"product_id": p["id"], "quantity": 1}])
    order = r.json()["data"]
    assert order["items"][0]["price_at_purchase"] == 50.0

    # Update price
    client.put(f"/api/v1/products/{p['id']}", json={"price": 99.0})

    # Re-fetch the order — price_at_purchase must still be 50.0
    r2 = client.get(f"/api/v1/orders/{order['id']}")
    assert r2.json()["data"]["items"][0]["price_at_purchase"] == 50.0


def test_order_rejected_insufficient_stock(client):
    p = make_product(client, stock=2)
    c = make_customer(client)
    r = make_order(client, c["id"], [{"product_id": p["id"], "quantity": 5}])
    assert r.status_code == 422
    assert r.json()["success"] is False
    # Stock must be unchanged — no partial deduction
    assert _stock(client, p["id"]) == 2


def test_order_atomic_rollback_on_second_item_failure(client):
    """If item 2 fails, item 1's stock deduction must be rolled back."""
    p1 = make_product(client, sku="P1", stock=10, price=10.0)
    p2 = make_product(client, sku="P2", stock=1,  price=10.0)
    c  = make_customer(client)

    r = make_order(client, c["id"], [
        {"product_id": p1["id"], "quantity": 2}, 
        {"product_id": p2["id"], "quantity": 5},  
    ])
    assert r.status_code == 422
    # p1 stock must NOT have been deducted
    assert _stock(client, p1["id"]) == 10
    assert _stock(client, p2["id"]) == 1


def test_cancel_order_restores_stock(client):
    p = make_product(client, stock=10, price=15.0)
    c = make_customer(client)
    order = make_order(client, c["id"], [{"product_id": p["id"], "quantity": 4}]).json()["data"]

    r = client.post(f"/api/v1/orders/{order['id']}/cancel")
    assert r.status_code == 200
    assert r.json()["data"]["status"] == "CANCELLED"
    assert _stock(client, p["id"]) == 10


def test_cancel_already_cancelled_order_rejected(client):
    p = make_product(client, stock=10, price=5.0)
    c = make_customer(client)
    order = make_order(client, c["id"], [{"product_id": p["id"], "quantity": 1}]).json()["data"]
    client.post(f"/api/v1/orders/{order['id']}/cancel")
    r = client.post(f"/api/v1/orders/{order['id']}/cancel")
    assert r.status_code == 409


def test_delete_order_restores_stock(client):
    p = make_product(client, stock=10, price=5.0)
    c = make_customer(client)
    order = make_order(client, c["id"], [{"product_id": p["id"], "quantity": 3}]).json()["data"]

    r = client.delete(f"/api/v1/orders/{order['id']}")
    assert r.status_code == 204
    assert _stock(client, p["id"]) == 10


def test_delete_cancelled_order_does_not_double_restock(client):
    p = make_product(client, stock=10, price=5.0)
    c = make_customer(client)
    order = make_order(client, c["id"], [{"product_id": p["id"], "quantity": 2}]).json()["data"]

    client.post(f"/api/v1/orders/{order['id']}/cancel")   
    client.delete(f"/api/v1/orders/{order['id']}")        
    assert _stock(client, p["id"]) == 10


def test_order_with_nonexistent_customer_rejected(client):
    p = make_product(client)
    r = make_order(client, 99999, [{"product_id": p["id"], "quantity": 1}])
    assert r.status_code == 404


def test_order_with_nonexistent_product_rejected(client):
    c = make_customer(client)
    r = make_order(client, c["id"], [{"product_id": 99999, "quantity": 1}])
    assert r.status_code == 404


def test_order_empty_items_rejected(client):
    c = make_customer(client)
    r = client.post("/api/v1/orders", json={"customer_id": c["id"], "items": []})
    assert r.status_code == 422


def test_orders_pagination(client):
    p = make_product(client, stock=100)
    c = make_customer(client)
    for _ in range(5):
        make_order(client, c["id"], [{"product_id": p["id"], "quantity": 1}])

    r = client.get("/api/v1/orders?page=1&limit=3")
    body = r.json()
    assert body["success"] is True
    assert len(body["data"]) == 3
    assert body["total"] == 5
    assert body["pages"] == 2
