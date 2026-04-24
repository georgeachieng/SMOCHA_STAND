# Standard API response helpers
# keeps our responses consistent across all routes
from flask import jsonify


def success_response(msg, data=None, status_code=200):
    return jsonify({
        "status": "success",
        "message": msg,
        "data": data
    }), status_code


def error_response(message, errors=None, status_code=400):
    return jsonify({
        "status": "error",
        "message": message,
        "errors": errors or []
    }), status_code


def created_response(message, data=None):
    return success_response(message, data, 201)


def not_found_response(message="Resource not found"):
    return error_response(message, status_code=404)


def unauthorized_response(message="Unauthorized"):
    return error_response(message, status_code=401)


# TODO: add a server_error_response for 500s maybe?
