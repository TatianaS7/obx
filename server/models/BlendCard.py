from connection import db
from enum import Enum
from _types import BlendType, BlendCategory, BottleSize, BottleType


class BlendCard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    blend_name = db.Column(db.String(100), nullable=True)
    blend_description = db.Column(db.String(500), nullable=True)
    blend_type = db.column(db.Enum(BlendType), nullable=False)
    blend_category = db.Column(db.Enum(BlendCategory), nullable=False)
    bottle_size = db.Column(db.Enum(BottleSize), nullable=False)
    bottle_type = db.Column(db.Enum(BottleType), nullable=False)
    ingredients = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    def __init__(self, created_by, blend_name, blend_description, blend_type, blend_category, bottle_size, bottle_type, ingredients):
        self.created_by = created_by
        self.blend_name = blend_name
        self.blend_description = blend_description
        self.blend_type = blend_type
        self.blend_category = blend_category
        self.bottle_size = bottle_size
        self.bottle_type = bottle_type
        self.ingredients = ingredients
        

