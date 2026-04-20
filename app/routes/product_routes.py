from flask import Blueprint, request, jsonify
from app.services.product_service import ProductService
from app.schemas.product_schema import product_schema, products_schema
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
