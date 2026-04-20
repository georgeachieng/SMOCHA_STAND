from app.extensions import ma
from marshmallow import fields, validate

class ProductSchema(ma.Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    description = fields.Str()
    price = fields.Float(required=True, validate=validate.Range(min=0.01))
    stock_quantity = fields.Int(validate=validate.Range(min=0))
    reorder_level = fields.Int(validate=validate.Range(min=0))
    category_id = fields.Int(required=True)
    supplier_id = fields.Int()
    
    total_stock_value = fields.Method("get_stock_value", dump_only=True)
    status = fields.Method("get_stock_status", dump_only=True)
    created_at = fields.DateTime(dump_only=True) # Will now show EAT in JSON

    def get_stock_value(self, obj):
        return obj.price * obj.stock_quantity

    def get_stock_status(self, obj):
        if obj.stock_quantity == 0:
            return "out_of_stock"
        elif obj.stock_quantity <= obj.reorder_level:
            return "low_stock"
        return "in_stock"

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)