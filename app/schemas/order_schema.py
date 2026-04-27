from app.extensions import ma
from marshmallow import fields


class OrderSchema(ma.Schema):
    id = fields.Int(dump_only=True)
    customer_id = fields.Int(dump_only=True)
    customer_name = fields.Str(required=True)
    items = fields.List(fields.Dict(), required=True)
    total_price = fields.Float(dump_only=True)
    status = fields.Str(dump_only=True)
    served_by = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)


order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)
