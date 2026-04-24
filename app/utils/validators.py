# validation helpers for the smocha stand API
import re


def validate_email(email):
    """check if email format is valid - got this regex from stackoverflow"""
    if not email:
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_required_fields(data, required_fields):
    missing = [f for f in required_fields if not data.get(f)]
    return missing


def validate_positive_integer(value):
    return isinstance(value, int) and value > 0


def validate_transaction_type(txn_type):
    # only two types for now - stock_in when restocking, stock_out when selling
    return txn_type in ['stock_in', 'stock_out']


def validate_password_strength(password):
    # keeping it simple for now, 6 chars minimum
    if len(password) < 6:
        return False, "Password must be at least 6 characters"
    return True, None
