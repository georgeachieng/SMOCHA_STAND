from flask import Blueprint, request, jsonify
from app.services.product_service import ProductService
from app.schemas.product_schema import product_schema, products_schema
from app.utils.decorators import role_required
from marshmallow import ValidationError

product_bp = Blueprint('products', __name__, url_prefix='/api')

@product_bp.route('/products', methods=['GET'])
def get_products():
    products = ProductService.get_all_products()
    return jsonify({
        "status": "success",
        "message": "Products retrieved successfully",
        "data": products_schema.dump(products)
    }), 200

@product_bp.route('/products', methods=['POST'])
def create_product():
    json_data = request.get_json()
    try:
        validated_data = product_schema.load(json_data)
    except ValidationError as err:
        return jsonify({
            "status": "error",
            "message": "Validation failed",
            "errors": err.messages
        }), 400

    new_product = ProductService.create_product(validated_data)
    return jsonify({
        "status": "success",
        "message": "Product created successfully",
        "data": product_schema.dump(new_product)
    }), 201

@product_bp.route('/inventory/low-stock', methods=['GET'])
def get_low_stock():
    products = ProductService.get_low_stock_products()
    return jsonify({
        "status": "success",
        "message": "Low stock products retrieved (EAT Time)",
        "data": products_schema.dump(products)
    }), 200


@product_bp.route('/products/<int:product_id>', methods=['PUT'])
@role_required('owner')
def update_product(product_id):
    json_data = request.get_json(silent=True) or {}
    try:
        validated_data = product_schema.load(json_data, partial=True)
    except ValidationError as err:
        return jsonify({
            "status": "error",
            "message": "Validation failed",
            "errors": err.messages,
        }), 400

    product = ProductService.get_product_by_id(product_id)
    if not product:
        return jsonify({"status": "error", "message": "Product not found"}), 404

    updated_product = ProductService.update_product(product, validated_data)
    return jsonify({
        "status": "success",
        "message": "Product updated successfully",
        "data": product_schema.dump(updated_product),
    }), 200
