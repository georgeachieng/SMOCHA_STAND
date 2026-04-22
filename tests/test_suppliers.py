import json
from app import create_app
from app.extensions import db


def setup_test_app():
    app = create_app()
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    with app.app_context():
        db.drop_all()
        db.create_all()

    return app


def test_create_supplier():
    app = setup_test_app()
    client = app.test_client()

    response = client.post(
        "/api/suppliers",
        data=json.dumps({
            "name": "Coca-Cola",
            "phone": "0712345678",
            "email": "coke@example.com",
            "address": "Nairobi"
        }),
        content_type="application/json"
    )

    assert response.status_code == 201
    data = response.get_json()
    assert data["status"] == "success"
    assert data["data"]["name"] == "Coca-Cola"


def test_get_suppliers():
    app = setup_test_app()
    client = app.test_client()

    client.post(
        "/api/suppliers",
        data=json.dumps({
            "name": "Coca-Cola",
            "phone": "0712345678",
            "email": "coke@example.com",
            "address": "Nairobi"
        }),
        content_type="application/json"
    )

    response = client.get("/api/suppliers")

    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "success"
    assert len(data["data"]) == 1


def test_update_supplier():
    app = setup_test_app()
    client = app.test_client()

    client.post(
        "/api/suppliers",
        data=json.dumps({
            "name": "Coca-Cola",
            "phone": "0712345678",
            "email": "coke@example.com",
            "address": "Nairobi"
        }),
        content_type="application/json"
    )

    response = client.put(
        "/api/suppliers/1",
        data=json.dumps({
            "name": "Coca-Cola Ltd",
            "email": "newcoke@example.com"
        }),
        content_type="application/json"
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["data"]["name"] == "Coca-Cola Ltd"


def test_delete_supplier():
    app = setup_test_app()
    client = app.test_client()

    client.post(
        "/api/suppliers",
        data=json.dumps({
            "name": "Coca-Cola",
            "phone": "0712345678",
            "email": "coke@example.com",
            "address": "Nairobi"
        }),
        content_type="application/json"
    )

    response = client.delete("/api/suppliers/1")

    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "success"


def test_supplier_invalid_email():
    app = setup_test_app()
    client = app.test_client()

    response = client.post(
        "/api/suppliers",
        data=json.dumps({
            "name": "Bad Supplier",
            "email": "not-an-email"
        }),
        content_type="application/json"
    )

    assert response.status_code == 400
    data = response.get_json()
    assert data["status"] == "error"
    assert "email" in data["errors"]