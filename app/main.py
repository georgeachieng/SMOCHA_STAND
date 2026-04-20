from flask import Flask, jsonify

from app.config import Config
from app.extensions import db, init_extensions, jwt
from app.routes.auth_routes import auth_bp
from app.routes.user_routes import user_bp


def create_app(config_object=None):
    app = Flask(__name__)
    app.config.from_object(config_object or Config)

    init_extensions(app)
    register_blueprints(app)
    register_error_handlers(app)

    with app.app_context():
        if app.config.get("AUTO_CREATE_TABLES", True):
            db.create_all()

    return app


def register_blueprints(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)


def register_error_handlers(app):
    @jwt.unauthorized_loader
    def handle_missing_token(reason):
        return jsonify({"message": reason}), 401

    @jwt.invalid_token_loader
    def handle_invalid_token(reason):
        return jsonify({"message": reason}), 401

    @jwt.expired_token_loader
    def handle_expired_token(jwt_header, jwt_payload):
        return jsonify({"message": "Token has expired"}), 401

    @jwt.revoked_token_loader
    def handle_revoked_token(jwt_header, jwt_payload):
        return jsonify({"message": "Token has been revoked"}), 401
