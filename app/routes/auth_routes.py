from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models.user import User


auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

VALID_ROLES = {"admin", "staff"}


def _validate_registration_payload(payload):
    required_fields = ("username", "email", "password")
    missing = [field for field in required_fields if not payload.get(field)]

    if missing:
        return f"Missing required fields: {', '.join(missing)}"

    if len(payload["password"]) < 8:
        return "Password must be at least 8 characters long"

    return None


@auth_bp.post("/register")
def register():
    payload = request.get_json(silent=True) or {}
    validation_error = _validate_registration_payload(payload)
    if validation_error:
        return jsonify({"message": validation_error}), 400

    if User.query.filter_by(username=payload["username"]).first():
        return jsonify({"message": "Username already exists"}), 409

    if User.query.filter_by(email=payload["email"]).first():
        return jsonify({"message": "Email already exists"}), 409

    requested_role = payload.get("role", "staff")
    is_first_user = User.query.count() == 0

    if requested_role not in VALID_ROLES:
        return jsonify({"message": "Invalid role supplied"}), 400

    if requested_role == "admin" and not is_first_user:
        return jsonify({"message": "Admin role cannot be self-assigned"}), 403

    user = User(
        username=payload["username"].strip(),
        email=payload["email"].strip().lower(),
        role=requested_role if is_first_user else "staff",
    )
    user.set_password(payload["password"])

    db.session.add(user)
    db.session.commit()

    return (
        jsonify(
            {
                "message": "User registered successfully",
                "user": user.to_dict(),
            }
        ),
        201,
    )


@auth_bp.post("/login")
def login():
    payload = request.get_json(silent=True) or {}
    username = payload.get("username", "").strip()
    password = payload.get("password", "")

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if user is None or not user.check_password(password):
        return jsonify({"message": "Invalid username or password"}), 401

    if not user.is_active:
        return jsonify({"message": "User account is inactive"}), 403

    access_token = create_access_token(
        identity=user.jwt_identity(),
        additional_claims=user.jwt_claims(),
    )

    return jsonify(
        {
            "message": "Login successful",
            "access_token": access_token,
            "user": user.to_dict(),
        }
    )
