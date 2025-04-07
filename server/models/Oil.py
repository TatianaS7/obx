from connection import db
from enum import Enum
from _types import OilType

class Oil(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(500), nullable=True)
    oil_type = db.Column(db.Enum(OilType), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    def __init__(self, name, description, oil_type, is_active=True):
        self.name = name
        self.description = description
        self.oil_type = oil_type
        self.is_active = is_active

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'oil_type': self.oil_type.value,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }
    
