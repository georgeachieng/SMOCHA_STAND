"""
Inventory service for Smocha Stand
Handles all the stock in/out logic for the shop
- Person 4 (transactions feature)
"""
from ..extensions import db
from ..models.product import Product
from ..models.stock_transaction import StockTransaction


class InventoryService:
    # TODO: maybe add pagination later if we get too many transactions
    @staticmethod
    def get_all_transactions():
        return StockTransaction.query.order_by(
            StockTransaction.created_at.desc()
        ).all()

    @staticmethod
    def get_transaction_by_id(transaction_id):
        return StockTransaction.query.get(transaction_id)

    @staticmethod
    def get_transactions_by_product(product_id):
        return StockTransaction.query.filter_by(product_id=product_id).all()

    @staticmethod
    def record_transaction(product_id, user_id, transaction_type, quantity, note=''):
        product = Product.query.get(product_id)
        if not product:
            return None, "Product not found"

        # cant sell more smocha ingredients than we have lol
        if transaction_type == 'stock_out' and product.stock_quantity < quantity:
            return None, f"Insufficient stock. Available: {product.stock_quantity}"

        # update the actual stock count
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

        return transaction, None

    @staticmethod
    def get_low_stock_products(threshold=10):
        # 10 seems like a good default, can change if needed
        return Product.query.filter(Product.stock_quantity <= threshold).all()

    @staticmethod
    def get_stock_summary():
        products = Product.query.all()
        return {
            'total_products': len(products),
            'total_stock_value': sum(p.price * p.stock_quantity for p in products),
            'low_stock_count': len([p for p in products if p.stock_quantity <= 10])
        }
