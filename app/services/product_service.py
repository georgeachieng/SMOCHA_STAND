from app.models.product import Product
from app.extensions import db

class ProductService:
    @staticmethod
    def get_all_products():
        return Product.query.all()

    @staticmethod
    def get_product_by_id(product_id):
        return Product.query.get(product_id)

    @staticmethod
    def get_low_stock_products():
        # Returns items that are above 0 but at or below their specific reorder_level
        return Product.query.filter(
            Product.stock_quantity <= Product.reorder_level, 
            Product.stock_quantity > 0
        ).all()

    @staticmethod
    def create_product(data):
        new_product = Product(
            name=data['name'],
            description=data.get('description'),
            price=data['price'],
            stock_quantity=data.get('stock_quantity', 0),
            reorder_level=data.get('reorder_level', 5),
            category_id=data['category_id'],
            supplier_id=data.get('supplier_id')
        )
        db.session.add(new_product)
        db.session.commit()
        return new_product

    @staticmethod
    def update_product(product, data):
        for field in [
            'name',
            'description',
            'price',
            'stock_quantity',
            'reorder_level',
            'category_id',
            'supplier_id',
        ]:
            if field in data:
                setattr(product, field, data[field])

        db.session.commit()
        return product