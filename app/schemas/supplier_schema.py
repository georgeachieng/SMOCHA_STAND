from marshmallow import Schema, fields, validate, validates, ValidationError


class SupplierSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(
        required=True,
        validate=validate.Length(min=1, error="Supplier name is required")
    )
    phone = fields.Str(required=False, allow_none=True)
    email = fields.Email(required=False, allow_none=True)
    address = fields.Str(required=False, allow_none=True)
    created_at = fields.DateTime(dump_only=True)

    @validates("name")
    def validate_name(self, value, **kwargs):
        if not value.strip():
            raise ValidationError("Supplier name is required")