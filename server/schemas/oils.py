from marshmallow import fields, Schema
from .._types import OilType
# from ..models import Oil


class OilSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str(required=True)
    oil_type = fields.Enum(OilType, required=True)
    is_active = fields.Bool(missing=True)
    created_at = fields.DateTime(dump_only=True)