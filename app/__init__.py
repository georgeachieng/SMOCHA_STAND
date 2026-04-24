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

    # import all models so SQLAlchemy knows about them
    from .models import User, Category, Supplier, Product, StockTransaction

    from .routes.transaction_routes import transaction_bp
    from .routes.auth_routes import auth_bp
    from .routes.user_routes import user_bp
    from .routes.product_routes import product_bp
    from .routes.category_routes import category_bp
    from .routes.supplier_routes import supplier_bp

    # only override prefixes where blueprint has wrong/no prefix
    app.register_blueprint(transaction_bp, url_prefix='/api/transactions')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(product_bp)  # already has /api prefix
    app.register_blueprint(category_bp)  # already has /api/categories
    app.register_blueprint(supplier_bp)  # already has /api/suppliers

    return app