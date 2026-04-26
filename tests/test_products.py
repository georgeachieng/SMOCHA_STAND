import json

def test_create_product_success(client):
    """Test successful creation and check if reorder_level defaults to 5."""
    payload = {
        "name": "Fresh Milk",
        "price": 60.0,
        "category_id": 1,
        "stock_quantity": 10
    }
    response = client.post('/api/products', json=payload)
    data = json.loads(response.data)
    assert response.status_code == 201
    assert data['data']['reorder_level'] == 5
    assert data['data']['status'] == "in_stock"

def test_low_stock_logic(client):
    """Test that a product with 3 items triggers low stock (since 3 <= 5)."""
    payload = {
        "name": "Bread",
        "price": 55.0,
        "category_id": 1,
        "stock_quantity": 3
    }
    client.post('/api/products', json=payload)
    response = client.get('/api/inventory/low-stock')
    data = json.loads(response.data)
    assert response.status_code == 200
    assert any(item['name'] == "Bread" for item in data['data'])