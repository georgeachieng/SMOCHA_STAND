import os
import sys

# Add project root to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest

from app import create_app
from app.config import TestingConfig
from app.extensions import db


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