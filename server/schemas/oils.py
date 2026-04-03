from marshmallow import fields, Schema
from .._types import OilType, OilTag
# from ..models import Oil


class OilSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str(required=True)
    origin_country = fields.Str(required=False, allow_none=True)
    source = fields.Str(required=False, allow_none=True)
    extraction_method = fields.Str(required=False, allow_none=True)
    tags = fields.List(fields.Enum(OilTag, by_value=True), load_default=list)
    oil_type = fields.Enum(OilType, required=True)
    is_active = fields.Bool(missing=True)
    created_at = fields.DateTime(dump_only=True)