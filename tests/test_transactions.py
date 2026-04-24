# Tests for stock transaction endpoints
# Person 4 - testing the inventory/transaction stuff
# learned pytest fixtures from the flask docs, pretty cool

import pytest
from app import create_app
from app.extensions import db
from app.models.product import Product
from app.models.category import Category
from app.models.stock_transaction import StockTransaction


@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def sample_product(app):
    """create a test product - need this for most transaction tests"""
    with app.app_context():
        category = Category(name='Smocha Ingredients')
        db.session.add(category)
        db.session.commit()

        # using smocha-related test data to keep it consistent
        product = Product(
            name='Sausages',
            price=100.0,
            stock_quantity=50,
            category_id=category.id
        )
        db.session.add(product)
        db.session.commit()
        return product.id


class TestTransactionEndpoints:
    def test_get_transactions_empty(self, client):
        response = client.get('/api/transactions/')
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'success'
        assert data['data'] == []

    def test_create_stock_in_transaction(self, client, sample_product):
        response = client.post('/api/transactions/', json={
            'product_id': sample_product,
            'user_id': 1,
            'transaction_type': 'stock_in',
            'quantity': 10,
            'note': 'Restock'
        })
        assert response.status_code == 201
        data = response.get_json()
        assert data['status'] == 'success'
        assert data['data']['quantity'] == 10

    def test_create_stock_out_transaction(self, client, sample_product):
        response = client.post('/api/transactions/', json={
            'product_id': sample_product,
            'user_id': 1,
            'transaction_type': 'stock_out',
            'quantity': 5,
            'note': 'Sale'
        })
        assert response.status_code == 201
        data = response.get_json()
        assert data['status'] == 'success'

    def test_stock_out_insufficient_quantity(self, client, sample_product):
        # this one took me a while to figure out - edge case for selling more than we have
        response = client.post('/api/transactions/', json={
            'product_id': sample_product,
            'user_id': 1,
            'transaction_type': 'stock_out',
            'quantity': 999  # way more than the 50 we have
        })
        assert response.status_code == 400
        data = response.get_json()
        assert data['status'] == 'error'
        assert 'Insufficient stock' in data['message']

    def test_invalid_transaction_type(self, client, sample_product):
        response = client.post('/api/transactions/', json={
            'product_id': sample_product,
            'user_id': 1,
            'transaction_type': 'invalid',
            'quantity': 10
        })
        assert response.status_code == 400

    def test_get_transaction_by_id(self, client, sample_product):
        client.post('/api/transactions/', json={
            'product_id': sample_product,
            'user_id': 1,
            'transaction_type': 'stock_in',
            'quantity': 10
        })
        response = client.get('/api/transactions/1')
        assert response.status_code == 200

    def test_get_nonexistent_transaction(self, client):
        response = client.get('/api/transactions/999')
        assert response.status_code == 404
