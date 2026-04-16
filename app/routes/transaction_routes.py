from flask import Blueprint, jsonify
from ..models.stock_transaction import StockTransaction
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
