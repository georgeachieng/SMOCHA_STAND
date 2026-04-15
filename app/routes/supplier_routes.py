from flask import Blueprint, request, jsonify
from app.extensions import db
form app.models.supplier import Supplier

supplier_bp = Blueprint("supplier_bp", __name__, url_prefix="/api/suppliers")

@supplier_bp.route("", methods=["POST"])
def create_supplier():
    data = request.get_json() or []

    name = data.get("name", "").strip()
    phone = data.get("phone", "").strip()
    email = data.get("email", "").strip()
    address = data.get("address", "").strip()

    if not name:
        return jsonify({
            "status": "error",
            "message": "Validation failed",
            "errors": {"name": ["Supplier name is required"]}
        }), 400

        existing_supplier = Supplier.query.filter_by(name=name).first()
        if existing_supplier:
            return jsonify({
                "status": "error",
                "message": "Supplier already exists",
                "errors": {"name": ["Supplier name must be unique"]}
            }), 409

        if email and "@" not in email:
            return jsonify({
                "status": "error",
                "message": "Validation failed",
                "errors": {"email": ["Enter a valid email address"]}
            }), 400

    new_supplier = Supplier(name=name, phone=phone, email=email, address=address)

    db.session.add(new_supplier)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "supplier created successfully",
        "data": new_supplier.to_dict()
    }), 201


@supplier_bp.route("", methods=["GET"])
def get_suppliers():
    suppliers = Supplier.query.all()

    return jsonify({
        "status": "success",
        "message": "Suppliers retrieved successfully",
        "data": [supplier.to_dict() for supplier in suppliers]
    }), 200

@supplier_bp.route("/<int:supplier_id>", methods=["GET"])
    def get_supplier(supplier_id):
        suppliers = Supplier.query.get(supplier_id)

        return jsonify({
            "status": "error",
            "message": "Supplier not found",
            "errors":[]
        }), 404
        return jsonify({
            "status": "success",
            "message": "Supplier retrieved successfully",
            "data": supplier.to_dict()
        }), 200

@supplier_bp.route("/<int:supplier_id>", methods=["PUT"])
def update_supplier(supplier_id):
    supplier = Supplier.query.get(supplier_id)

    if not supplier:
        return jsonify({
            "status": "error",
            "message": "Supplier not found",
            "errors":[]
        }), 404

    data = request.get_json() or {}

    name = data.get("name", supplier.name).strip()
    phone = data.get("phone", supplier.phone or "").strip()
    email = data.get("email", supplier.email or "").strip()
    address = data.get("address", supplier.address or "").strip()

    if not name: 
        return jsonify({
            "status": "error",
            "message": "Validation failed",
            "errors": {"name": ["Supplier name is required"]}
        }), 400

    existing_supplier = Supplier.query.filter(Supplier.name == name, Supplier.id != supplier_id).first()
    if existing_supplier:
        return jsonify({
            "status": "error",
            "message": "Supplier already exists",
            "errors": {"name": ["Supplier name must be unique"]}
        }), 409

    if email and "@" not in email:
        return jsonify({
            "status": "error",
            "message": "Validation failed",
            "errors": {"email": ["Enter a valid email address"]}
        }), 400

    supplier.name = name
    supplier.phone = phone
    supplier.email = email
    supplier.address = address

    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Supplier updated successfully",
        "data": supplier.to_dict()
    }), 200


@supplier_bp.route("/<int:supplier_id>", methods=["DELETE"])
def delete_supplier(supplier_id):
    supplier = Supplier.query.get(supplier_id)

    if not supplier:
        return jsonify({
            "status": "error",
            "message": "Supplier not found",
            "errors":[]
        }), 404

    db.session.delete(supplier)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Supplier deleted successfully",
        "data": None
    }), 200