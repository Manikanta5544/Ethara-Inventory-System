from tests.conftest import make_customer, make_order, make_product

def test_dashboard_totals(client):
    make_product(client, sku="D1", stock=100, price=10.0)
    make_product(client, sku="D2", stock=5, price=20.0) 
    c = make_customer(client)
    p_id = client.get("/api/v1/products").json()["data"][0]["id"]
    make_order(client, c["id"], [{"product_id": p_id, "quantity": 2}])

    r = client.get("/api/v1/dashboard")
    assert r.status_code == 200
    data = r.json()["data"]

    assert data["total_products"] == 2
    assert data["total_customers"] == 1
    assert data["total_orders"] == 1
    assert data["low_stock_count"] == 1
    assert data["average_order_value"] == 20.0  


def test_dashboard_inventory_value(client):
    make_product(client, sku="IV-1", price=10.0, stock=5)  
    make_product(client, sku="IV-2", price=20.0, stock=3) 
    r = client.get("/api/v1/dashboard")
    assert r.json()["data"]["inventory_value"] == 110.0


def test_health_live(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["data"]["status"] == "live"
