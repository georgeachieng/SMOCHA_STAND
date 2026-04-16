from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.extensions import db
from app.models.category import Category
from app.schemas.category_schema import CategorySchema

category_bp = Blueprint("category_bp", __name__, url_prefix="/api/categories")

category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)


@category_bp.route("", methods=["POST"])
def create_category():
    data = request.get_json() or {}

    try:
        validated_data = category_schema.load(data)
    except ValidationError as err:
        return jsonify({
            "status": "error",
            "message": "Validation failed",
            "errors": err.messages
        }), 400

    name = validated_data["name"].strip()
    description = validated_data.get("description", "")

    existing_category = Category.query.filter_by(name=name).first()
    if existing_category:
        return jsonify({
            "status": "error",
            "message": "Category already exists",
            "errors": {"name": ["Category name must be unique"]}
        }), 409

    category = Category(name=name, description=description)
    db.session.add(category)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Category created successfully",
        "data": category_schema.dump(category)
    }), 201


@category_bp.route("", methods=["GET"])
def get_categories():
    categories = Category.query.all()

    return jsonify({
        "status": "success",
        "message": "Categories retrieved successfully",
        "data": categories_schema.dump(categories)
    }), 200


@category_bp.route("/<int:category_id>", methods=["GET"])
def get_category(category_id):
    category = Category.query.get(category_id)

    if not category:
        return jsonify({
            "status": "error",
            "message": "Category not found",
            "errors": []
        }), 404

    return jsonify({
        "status": "success",
        "message": "Category retrieved successfully",
        "data": category_schema.dump(category)
    }), 200


@category_bp.route("/<int:category_id>", methods=["PUT"])
def update_category(category_id):
    category = Category.query.get(category_id)

    if not category:
        return jsonify({
            "status": "error",
            "message": "Category not found",
            "errors": []
        }), 404

    data = request.get_json() or {}

    try:
        validated_data = category_schema.load(data, partial=True)
    except ValidationError as err:
        return jsonify({
            "status": "error",
            "message": "Validation failed",
            "errors": err.messages
        }), 400

    name = validated_data.get("name", category.name).strip()
    description = validated_data.get("description", category.description or "")

    if not name:
        return jsonify({
            "status": "error",
            "message": "Validation failed",
            "errors": {"name": ["Category name is required"]}
        }), 400

    existing_category = Category.query.filter(
        Category.name == name,
        Category.id != category_id
    ).first()

    if existing_category:
        return jsonify({
            "status": "error",
            "message": "Category already exists",
            "errors": {"name": ["Category name must be unique"]}
        }), 409

    category.name = name
    category.description = description
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Category updated successfully",
        "data": category_schema.dump(category)
    }), 200


@category_bp.route("/<int:category_id>", methods=["DELETE"])
def delete_category(category_id):
    category = Category.query.get(category_id)

    if not category:
        return jsonify({
            "status": "error",
            "message": "Category not found",
            "errors": []
        }), 404

    db.session.delete(category)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Category deleted successfully",
        "data": None
    }), 200