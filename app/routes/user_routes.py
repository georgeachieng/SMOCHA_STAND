from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.models.user import User
from app.utils.decorators import current_user_required, role_required


user_bp = Blueprint("users", __name__, url_prefix="/users")


@user_bp.get("/me")
@current_user_required
def get_current_user(current_user):
    return jsonify({"user": current_user.to_dict()})


@user_bp.get("")
@jwt_required()
@role_required("admin")
def list_users():
    users = User.query.order_by(User.id.asc()).all()
    return jsonify({"users": [user.to_dict() for user in users]})
