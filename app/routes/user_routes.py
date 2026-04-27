from flask import Blueprint, jsonify, request
from app.models.user import User
from app.extensions import db
from app.utils.decorators import current_user_required, role_required


user_bp = Blueprint("users", __name__, url_prefix="/users")


@user_bp.get("/me")
@current_user_required
def get_current_user(current_user):
    return jsonify({"user": current_user.to_dict()})


@user_bp.get("")
@role_required("owner")
def list_users():
    users = User.query.order_by(User.id.asc()).all()
    return jsonify({"users": [user.to_dict() for user in users]})


@user_bp.get("/employees")
@role_required("owner")
def list_employees():
    employees = User.query.filter(User.role == "employee").order_by(User.id.asc()).all()
    return jsonify({"employees": [employee.to_dict() for employee in employees]})


@user_bp.post("/employees")
@role_required("owner")
def create_employee():
    payload = request.get_json(silent=True) or {}
    username = payload.get("username", "").strip()
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")

    if not username or not email or not password:
        return jsonify({"message": "username, email, and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 409

    if len(password) < 8:
        return jsonify({"message": "Password must be at least 8 characters long"}), 400

    employee = User(username=username, email=email, role="employee")
    employee.set_password(password)
    db.session.add(employee)
    db.session.commit()

    return jsonify({"message": "Employee created successfully", "data": employee.to_dict()}), 201


@user_bp.patch("/<int:user_id>/role")
@role_required("owner")
def update_user_role(user_id):
    payload = request.get_json(silent=True) or {}
    new_role = payload.get("role", "").strip().lower()

    if new_role not in {"employee", "customer"}:
        return jsonify({"message": "role must be either employee or customer"}), 400

    user = db.session.get(User, user_id)
    if user is None:
        return jsonify({"message": "User not found"}), 404

    if user.role == "owner":
        return jsonify({"message": "Owner permissions cannot be changed"}), 403

    user.role = new_role
    db.session.commit()

    return jsonify(
        {
            "message": f"User role updated to {new_role}",
            "user": user.to_dict(),
        }
    )


@user_bp.delete("/employees/<int:user_id>")
@role_required("owner")
def delete_employee(user_id):
    employee = User.query.get(user_id)
    if employee is None or employee.role != "employee":
        return jsonify({"message": "Employee not found"}), 404

    db.session.delete(employee)
    db.session.commit()
    return jsonify({"message": "Employee removed successfully"}), 200
