from connection import db
from .._types import DiscountCode

class Discount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    code = db.Column(db.Enum(DiscountCode), nullable=False, unique=True)
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