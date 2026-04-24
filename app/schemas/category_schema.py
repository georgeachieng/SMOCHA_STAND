from ..extensions import ma
from ..models.category import Category

class CategorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Category
        load_instance = True

category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)