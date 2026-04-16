from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models.stock_transaction import StockTransaction, Product
from ..schemas.transaction_schema import transaction_schema, transactions_schema

transaction_bp = Blueprint('transactions', __name__)


def success_response(message, data=None, status_code=200):
    return jsonify({"status": "success", "message": message, "data": data}), status_code


def error_response(message, errors=None, status_code=400):
    return jsonify({"status": "error", "message": message, "errors": errors or []}), status_code


# GET /api/transactions
@transaction_bp.route('/', methods=['GET'])
def get_transactions():
    transactions = StockTransaction.query.order_by(StockTransaction.created_at.desc()).all()
    return success_response("Transactions retrieved successfully", transactions_schema.dump(transactions))


# GET /api/transactions/<id>
@transaction_bp.route('/<int:id>', methods=['GET'])
def get_transaction(id):
    transaction = StockTransaction.query.get(id)
    if not transaction:
        return error_response("Transaction not found", status_code=404)
    return success_response("Transaction retrieved successfully", transaction_schema.dump(transaction))


# POST /api/transactions
@transaction_bp.route('/', methods=['POST'])
def create_transaction():
    data = request.get_json()

    if not data:
        return error_response("No input data provided")

    transaction_type = data.get('transaction_type')
    quantity = data.get('quantity')
    product_id = data.get('product_id')
    user_id = data.get('user_id', 1)
    note = data.get('note', '')

    # Validate required fields
    if not transaction_type or not quantity or not product_id:
        return error_response("transaction_type, quantity, and product_id are required")

    if transaction_type not in ['stock_in', 'stock_out']:
        return error_response("transaction_type must be 'stock_in' or 'stock_out'")

    if not isinstance(quantity, int) or quantity <= 0:
        return error_response("quantity must be a positive integer")

    product = Product.query.get(product_id)
    if not product:
        return error_response("Product not found", status_code=404)

    # Business rule: can't stock out more than available
    if transaction_type == 'stock_out' and product.stock_quantity < quantity:
        return error_response(
            f"Insufficient stock. Available: {product.stock_quantity}, Requested: {quantity}",
            status_code=400
        )

    # Update stock
    if transaction_type == 'stock_in':
        product.stock_quantity += quantity
    else:
        product.stock_quantity -= quantity

    transaction = StockTransaction(
        product_id=product_id,
        user_id=user_id,
        transaction_type=transaction_type,
        quantity=quantity,
        note=note
    )

    db.session.add(transaction)
    db.session.commit()

    return success_response("Transaction recorded successfully", transaction_schema.dump(transaction), 201)