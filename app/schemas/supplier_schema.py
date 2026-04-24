from ..extensions import ma
from ..models.supplier import Supplier

class SupplierSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Supplier
        load_instance = True

supplier_schema = SupplierSchema()
suppliers_schema = SupplierSchema(many=True)