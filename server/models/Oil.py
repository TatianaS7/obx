from ..connection import db
from enum import Enum
from .._types import OilType

class Oil(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(500), nullable=True)
    origin_country = db.Column(db.String(100), nullable=True)
    source = db.Column(db.String(120), nullable=True)
    extraction_method = db.Column(db.String(120), nullable=True)
    tags = db.Column(db.JSON, nullable=False, default=list)
    oil_type = db.Column(db.Enum(OilType), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    def __init__(
        self,
        name,
        description,
        oil_type,
        is_active=True,
        origin_country=None,
        source=None,
        extraction_method=None,
        tags=None,
    ):
        self.name = name
        self.description = description
        self.oil_type = oil_type
        self.is_active = is_active
        self.origin_country = origin_country
        self.source = source
        self.extraction_method = extraction_method
        self.tags = tags or []

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'origin_country': self.origin_country,
            'source': self.source,
            'extraction_method': self.extraction_method,
            'tags': self.tags or [],
            'oil_type': self.oil_type.value,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }
    
