import pytest

from app import create_app
from app.config import TestingConfig
from app.extensions import db
from app.models.user import User


@pytest.fixture
def app():
    app = create_app(TestingConfig)

    with app.app_context():
        db.drop_all()
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def register_user(client, username, email, password, role=None):
    payload = {
        "username": username,
        "email": email,
        "password": password,
    }
    if role is not None:
        payload["role"] = role
    return client.post("/auth/register", json=payload)


def login_user(client, username, password):
    return client.post(
        "/auth/login",
        json={"username": username, "password": password},
    )


def auth_header(token):
    return {"Authorization": f"Bearer {token}"}


def test_first_registered_user_can_be_admin(client):
    response = register_user(
        client,
        username="owner",
        email="owner@example.com",
        password="securepass",
        role="admin",
    )

    assert response.status_code == 201
    data = response.get_json()
    assert data["user"]["role"] == "admin"


def test_second_user_cannot_self_assign_admin_role(client):
    register_user(
        client,
        username="owner",
        email="owner@example.com",
        password="securepass",
        role="admin",
    )

    response = register_user(
        client,
        username="staffer",
        email="staff@example.com",
        password="securepass",
        role="admin",
    )

    assert response.status_code == 403
    assert response.get_json()["message"] == "Admin role cannot be self-assigned"


def test_login_returns_access_token(client):
    register_user(
        client,
        username="owner",
        email="owner@example.com",
        password="securepass",
    )

    response = login_user(client, "owner", "securepass")

    assert response.status_code == 200
    data = response.get_json()
    assert "access_token" in data
    assert data["user"]["username"] == "owner"


def test_current_user_endpoint_requires_valid_token(client):
    response = client.get("/users/me")

    assert response.status_code == 401


def test_current_user_endpoint_returns_profile(client):
    register_user(
        client,
        username="owner",
        email="owner@example.com",
        password="securepass",
    )
    login_response = login_user(client, "owner", "securepass")
    token = login_response.get_json()["access_token"]

    response = client.get("/users/me", headers=auth_header(token))

    assert response.status_code == 200
    assert response.get_json()["user"]["email"] == "owner@example.com"


def test_admin_can_list_users(client):
    register_user(
        client,
        username="admin",
        email="admin@example.com",
        password="securepass",
        role="admin",
    )
    register_user(
        client,
        username="staffer",
        email="staff@example.com",
        password="securepass",
    )
    token = login_user(client, "admin", "securepass").get_json()["access_token"]

    response = client.get("/users", headers=auth_header(token))

    assert response.status_code == 200
    assert len(response.get_json()["users"]) == 2


def test_non_admin_cannot_list_users(client):
    register_user(
        client,
        username="admin",
        email="admin@example.com",
        password="securepass",
        role="admin",
    )
    register_user(
        client,
        username="staffer",
        email="staff@example.com",
        password="securepass",
    )
    token = login_user(client, "staffer", "securepass").get_json()["access_token"]

    response = client.get("/users", headers=auth_header(token))

    assert response.status_code == 403


def test_inactive_user_cannot_authenticate(client, app):
    register_user(
        client,
        username="owner",
        email="owner@example.com",
        password="securepass",
    )

    with app.app_context():
        user = User.query.filter_by(username="owner").first()
        user.is_active = False
        db.session.commit()

    response = login_user(client, "owner", "securepass")

    assert response.status_code == 403
    assert response.get_json()["message"] == "User account is inactive"
