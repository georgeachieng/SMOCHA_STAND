import datetime

from app.extensions import db
from app.models.user import User


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    customer_name = db.Column(db.String(120), nullable=False)
    items = db.Column(db.JSON, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="pending")
    served_by = db.Column(db.String(120), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    customer = db.relationship(
        "User",
        backref=db.backref("orders", lazy=True),
        foreign_keys=[customer_id],
    )
