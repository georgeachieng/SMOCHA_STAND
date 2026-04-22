from app.extensions import db
from datetime import datetime, timedelta, timezone

# Define EAT (East Africa Time) as UTC + 3
EAT = timezone(timedelta(hours=3))

def get_eat_now():
    """Helper function to get current time in EAT."""
    return datetime.now(EAT)

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False)
    stock_quantity = db.Column(db.Integer, default=0, nullable=False)
    
    # reorder_level: The threshold to trigger a "low stock" warning
    reorder_level = db.Column(db.Integer, default=5, nullable=False)
    
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=True)
    
    # Timestamps set to EAT
    created_at = db.Column(db.DateTime, default=get_eat_now)
    updated_at = db.Column(db.DateTime, default=get_eat_now, onupdate=get_eat_now)

    category = db.relationship('Category', backref=db.backref('products', lazy=True))
    supplier = db.relationship('Supplier', backref=db.backref('products', lazy=True))

    def __repr__(self):
        return f"<Product {self.name} - Stock: {self.stock_quantity}>"