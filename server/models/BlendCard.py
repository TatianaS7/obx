from ..connection import db
from enum import Enum
from .._types import ProductType, BlendCategory, BottleSize, BottleType


class BlendCard(db.Model):
    __tablename__ = 'blend_card'

    id = db.Column(db.Integer, primary_key=True)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    name = db.Column(db.String(100), nullable=True)
    description = db.Column(db.String(500), nullable=True)

    product_type = db.Column(db.Enum(ProductType), nullable=False)
    category = db.Column(db.Enum(BlendCategory), nullable=False)
    bottle_size = db.Column(db.Enum(BottleSize), nullable=False)
    bottle_type = db.Column(db.Enum(BottleType), nullable=False)
        
    is_deleted = db.Column(db.Boolean, default=False, nullable=False)
    is_premade = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    oils = db.relationship('BlendCardOil', backref='blend_card', lazy=True)

    def __init__(self, created_by, name, description, product_type, category, bottle_size, bottle_type, is_deleted=False, is_premade=False, created_at=None):
        self.created_by = created_by
        self.name = name
        self.description = description
        self.product_type = product_type
        self.category = category
        self.bottle_size = bottle_size
        self.bottle_type = bottle_type
        self.is_deleted = is_deleted
        self.is_premade = is_premade
        self.created_at = created_at if created_at else db.func.current_timestamp()

    def serialize(self):
        return {
            'id': self.id,
            'created_by': self.created_by,
            'name': self.name,
            'description': self.description,
            'product_type': self.product_type.value,
            'category': self.category.value,
            'bottle_size': self.bottle_size.value,
            'bottle_type': self.bottle_type.value,
            'is_premade': self.is_premade,
            'is_deleted': self.is_deleted,
            'created_at': str(self.created_at),
            'oils': [oil.serialize() for oil in self.oils] 
        }