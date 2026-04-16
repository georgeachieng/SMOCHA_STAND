from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.extensions import db
from app.models.supplier import Supplier
from app.schemas.supplier_schema import SupplierSchema

supplier_bp = Blueprint("supplier_bp", __name__, url_prefix="/api/suppliers")

supplier_schema = SupplierSchema()
suppliers_schema = SupplierSchema(many=True)


@supplier_bp.route("", methods=["POST"])
def create_supplier():
    data = request.get_json() or {}

    try:
        validated_data = supplier_schema.load(data)
    except ValidationError as err:
        return jsonify({
            "status": "error",
            "message": "Validation failed",
            "errors": err.messages
        }), 400

    name = validated_data["name"].strip()
    phone = validated_data.get("phone", "")
    email = validated_data.get("email", "")
    address = validated_data.get("address", "")

    existing_supplier = Supplier.query.filter_by(name=name).first()
    if existing_supplier:
        return jsonify({
            "status": "error",
            "message": "Supplier already exists",
            "errors": {"name": ["Supplier name must be unique"]}
        }), 409

    new_supplier = Supplier(name=name, phone=phone, email=email, address=address)
    db.session.add(new_supplier)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Supplier created successfully",
        "data": supplier_schema.dump(new_supplier)
    }), 201


@supplier_bp.route("", methods=["GET"])
def get_suppliers():
    suppliers = Supplier.query.all()

    return jsonify({
        "status": "success",
        "message": "Suppliers retrieved successfully",
        "data": suppliers_schema.dump(suppliers)
    }), 200


@supplier_bp.route("/<int:supplier_id>", methods=["GET"])
def get_supplier(supplier_id):
    supplier = Supplier.query.get(supplier_id)

    if not supplier:
        return jsonify({
            "status": "error",
            "message": "Supplier not found",
            "errors": []
        }), 404

    return jsonify({
        "status": "success",
        "message": "Supplier retrieved successfully",
        "data": supplier_schema.dump(supplier)
    }), 200


@supplier_bp.route("/<int:supplier_id>", methods=["PUT"])
def update_supplier(supplier_id):
    supplier = Supplier.query.get(supplier_id)

    if not supplier:
        return jsonify({
            "status": "error",
            "message": "Supplier not found",
            "errors": []
        }), 404

    data = request.get_json() or {}

    try:
        validated_data = supplier_schema.load(data, partial=True)
    except ValidationError as err:
        return jsonify({
            "status": "error",
            "message": "Validation failed",
            "errors": err.messages
        }), 400

    name = validated_data.get("name", supplier.name).strip()
    phone = validated_data.get("phone", supplier.phone or "")
    email = validated_data.get("email", supplier.email or "")
    address = validated_data.get("address", supplier.address or "")

    if not name:
        return jsonify({
            "status": "error",
            "message": "Validation failed",
            "errors": {"name": ["Supplier name is required"]}
        }), 400

    existing_supplier = Supplier.query.filter(
        Supplier.name == name,
        Supplier.id != supplier_id
    ).first()

    if existing_supplier:
        return jsonify({
            "status": "error",
            "message": "Supplier already exists",
            "errors": {"name": ["Supplier name must be unique"]}
        }), 409

    supplier.name = name
    supplier.phone = phone
    supplier.email = email
    supplier.address = address
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Supplier updated successfully",
        "data": supplier_schema.dump(supplier)
    }), 200


@supplier_bp.route("/<int:supplier_id>", methods=["DELETE"])
def delete_supplier(supplier_id):
    supplier = Supplier.query.get(supplier_id)

    if not supplier:
        return jsonify({
            "status": "error",
            "message": "Supplier not found",
            "errors": []
        }), 404

    db.session.delete(supplier)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Supplier deleted successfully",
        "data": None
    }), 200