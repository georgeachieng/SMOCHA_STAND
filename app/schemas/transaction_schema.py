from ..extensions import ma
from ..models.stock_transaction import StockTransaction

class StockTransactionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = StockTransaction
        load_instance = True
        include_fk = True

transaction_schema = StockTransactionSchema()
transactions_schema = StockTransactionSchema(many=True)
