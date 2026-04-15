from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.category import Category

category_bp = Blueprint("category_bp", __name__, url_prefix ="/api/categories")


@category_bp.route("/", methods=["POST"])
def create_category():
    data = request.get_json() or {}

    name = data.get("name", "").strip()
    description = data.get("description", "").strip()

    if not name:
        return jsonify({
            "status": "error",
            "message": "Validation failed",
            "errors": {"name": ["Category name is required"]}
        }), 400

    
    existing_category = Category(name=name, description=description)
    db.session.add(existing_category)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Category created successfully",
        "data": existing_category.to_dict()
    }), 201


    @category_bp.route("", methods=["GET"])
    def get_categories():
        categories = Category.query.all()

        return jsonify({
            "status": "success",
            "message": "Categories retrived successfully",
            "data": [category.to_dict() for category in categories]
        }), 200


@category_bp.route("/<int:category_id>", methods=["GET"])
def get_category(category_id):
    category = Category.query.get(category_id)

    if not category:
        return jsonify({
            "status": "error",
            "message": "Category not found",
            "errors":[]
        }), 404

    return jsonify({
        "status": "success",
        "message": "Category retrived successfully",
        "data": category.to_dict()
    }), 200


@category_bp.route("/<int:category_id>", methods=["PUT"])
def update_category(category_id):
    category = Category.query.get(category_id)

    if not category:
        return jsonify({
            "status": "error",
            "message": "Category not found",
            "errors":[]
        }), 404

    data = request.get_json() or {}

    name = data.get("name", category.name).strip()
    description = data.get("description", category.description or "").strip()

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
        "data": category.to_dict()
    })


@category_bp.route("/<int:category_id>", methods=["DELETE"])
def delete_category(category_id):
    category = Category.query.get(category_id)

    if not category:
        return jsonify({
            "status": "error",
            "message": "Category not found",
            "errors":[]
        }), 404

    db.session.delete(category)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Category deleted successfully",
        "data": None
    }), 200