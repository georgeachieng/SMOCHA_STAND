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


def test_create_category():
    app = setup_test_app()
    client = app.test_client()

    response = client.post(
        "/api/categories",
        data=json.dumps({
            "name": "Drinks",
            "description": "Beverages"
        }),
        content_type="application/json"
    )

    assert response.status_code == 201
    data = response.get_json()
    assert data["status"] == "success"
    assert data["data"]["name"] == "Drinks"


def test_get_categories():
    app = setup_test_app()
    client = app.test_client()

    client.post(
        "/api/categories",
        data=json.dumps({
            "name": "Snacks",
            "description": "Quick bites"
        }),
        content_type="application/json"
    )

    response = client.get("/api/categories")

    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "success"
    assert len(data["data"]) == 1


def test_update_category():
    app = setup_test_app()
    client = app.test_client()

    client.post(
        "/api/categories",
        data=json.dumps({
            "name": "Snacks",
            "description": "Quick bites"
        }),
        content_type="application/json"
    )

    response = client.put(
        "/api/categories/1",
        data=json.dumps({
            "name": "Soft Drinks",
            "description": "Updated category"
        }),
        content_type="application/json"
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["data"]["name"] == "Soft Drinks"


def test_delete_category():
    app = setup_test_app()
    client = app.test_client()

    client.post(
        "/api/categories",
        data=json.dumps({
            "name": "Drinks",
            "description": "Beverages"
        }),
        content_type="application/json"
    )

    response = client.delete("/api/categories/1")

    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "success"


def test_category_validation_error():
    app = setup_test_app()
    client = app.test_client()

    response = client.post(
        "/api/categories",
        data=json.dumps({
            "description": "Missing name"
        }),
        content_type="application/json"
    )

    assert response.status_code == 400
    data = response.get_json()
    assert data["status"] == "error"
    assert "name" in data["errors"]