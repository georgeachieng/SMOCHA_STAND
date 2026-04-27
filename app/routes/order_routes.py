from flask import Blueprint, jsonify, request
from app.models.product import Product
from app.schemas.order_schema import order_schema, orders_schema
from app.services.order_service import OrderService
from app.utils.decorators import current_user_required, role_required

order_bp = Blueprint("orders", __name__, url_prefix="/api")


@order_bp.route("/orders", methods=["POST"])
@current_user_required
def create_order(current_user):
    if current_user.role != "customer":
        return jsonify({"message": "Only customers can place orders"}), 403

    payload = request.get_json(silent=True) or {}
    items = payload.get("items")

    if not isinstance(items, list) or len(items) == 0:
        return jsonify({"message": "Order items are required"}), 400

    validated_items = []
    total_price = 0.0

    for item in items:
        product_id = item.get("id")
        quantity = int(item.get("quantity", 0))

        if not product_id or quantity <= 0:
            return jsonify({"message": "Each order item must include an id and a positive quantity"}), 400

        product = Product.query.get(product_id)
        if product is None:
            return jsonify({"message": f"Product not found: {product_id}"}), 404

        validated_items.append(
            {
                "id": product.id,
                "name": product.name,
                "quantity": quantity,
                "price": product.price,
            }
        )
        total_price += product.price * quantity

    order = OrderService.create_order(
        current_user.id,
        current_user.username,
        validated_items,
        total_price,
    )

    return jsonify(
        {
            "status": "success",
            "message": "Order created successfully",
            "data": order_schema.dump(order),
        }
    ), 201


@order_bp.route("/orders", methods=["GET"])
@role_required("owner", "employee")
def get_orders():
    orders = OrderService.get_pending_orders()
    return jsonify(
        {
            "status": "success",
            "message": "Pending orders retrieved successfully",
            "data": orders_schema.dump(orders),
        }
    ), 200


@order_bp.route("/orders/<int:order_id>/serve", methods=["PUT"])
@current_user_required
@role_required("owner", "employee")
def serve_order(current_user, order_id):
    order = OrderService.get_order_by_id(order_id)
    if order is None:
        return jsonify({"message": "Order not found"}), 404

    try:
        served_order = OrderService.serve_order(order, current_user.username)
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400

    return jsonify(
        {
            "status": "success",
            "message": "Order served successfully",
            "data": order_schema.dump(served_order),
        }
    ), 200
