from flask import Flask
from .config import Config
from .extensions import db, ma, jwt, migrate, cors

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)

    from .routes.transaction_routes import transaction_bp
    app.register_blueprint(transaction_bp, url_prefix='/api/transactions')

    return app
