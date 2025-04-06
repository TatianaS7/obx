from connection import db
from enum import Enum
from _types import DiscountCode

class Discount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    code = db.Column(db.Enum(DiscountCode), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    percentage_off = db.Column(db.Float, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    expires_at = db.Column(db.DateTime, nullable=True)

    def __init__(self, name, code, description, percentage_off, is_active=True, expires_at=None):
        self.name = name
        self.code = code
        self.description = description
        self.percentage_off = percentage_off
        self.is_active = is_active
        self.expires_at = expires_at

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code.value,
            'description': self.description,
            'percentage_off': self.percentage_off,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None
        }