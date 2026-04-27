from app.extensions import db
from app.models.order import Order
from app.models.product import Product


class OrderService:
    @staticmethod
    def create_order(customer_id, customer_name, items, total_price):
        new_order = Order(
            customer_id=customer_id,
            customer_name=customer_name,
            items=items,
            total_price=total_price,
            status="pending",
        )
        db.session.add(new_order)
        db.session.commit()
        return new_order

    @staticmethod
    def get_pending_orders():
        return Order.query.filter_by(status="pending").order_by(Order.created_at.asc()).all()

    @staticmethod
    def get_order_by_id(order_id):
        return Order.query.get(order_id)

    @staticmethod
    def serve_order(order, served_by):
        if order.status != "pending":
            raise ValueError("Order is not pending")

        for item in order.items:
            product = Product.query.get(item.get("id"))
            if product is None:
                raise ValueError(f"Product not found: {item.get('id')}")
            quantity = int(item.get("quantity", 0))
            if product.stock_quantity < quantity:
                raise ValueError(
                    f"Not enough stock for {product.name}. Available: {product.stock_quantity}"
                )
            product.stock_quantity -= quantity

        order.status = "served"
        order.served_by = served_by
        db.session.commit()
        return order
