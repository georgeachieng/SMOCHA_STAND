from marshmallow import Schema, fields, validate, validates, ValidationError


class CategorySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(
        required=True,
        validate=validate.Length(min=1, error="Category name is required")
    )
    description = fields.Str(required=False, allow_none=True)
    created_at = fields.DateTime(dump_only=True)

    @validates("name")
    def validate_name(self, value, **kwargs):
        if not value.strip():
            raise ValidationError("Category name is required")