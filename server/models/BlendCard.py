from connection import db
from enum import Enum
from _types import ProductType, BlendCategory, BottleSize, BottleType


class BlendCard(db.Model):
    __tablename__ = 'blend_card'

    id = db.Column(db.Integer, primary_key=True)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    blend_name = db.Column(db.String(100), nullable=True)
    blend_description = db.Column(db.String(500), nullable=True)

    product_type = db.column(db.Enum(ProductType), nullable=False)
    blend_category = db.Column(db.Enum(BlendCategory), nullable=False)
    bottle_size = db.Column(db.Enum(BottleSize), nullable=False)
    bottle_type = db.Column(db.Enum(BottleType), nullable=False)
    
    base_oils = db.Column(db.JSON, nullable=False)
    secondary_oils = db.Column(db.JSON, nullable=True)
    premium_addons = db.Column(db.JSON, nullable=True)
    other_addons = db.Column(db.JSON, nullable=True)
    
    is_deleted = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    def __init__(self, created_by, blend_name, blend_description, product_type, blend_category, bottle_size, bottle_type, base_oils, secondary_oils=None, premium_addons=None, other_addons=None, is_deleted=False, created_at=None):
        self.created_by = created_by
        self.blend_name = blend_name
        self.blend_description = blend_description
        self.product_type = product_type
        self.blend_category = blend_category
        self.bottle_size = bottle_size
        self.bottle_type = bottle_type
        self.base_oils = base_oils
        self.secondary_oils = secondary_oils
        self.premium_addons = premium_addons
        self.other_addons = other_addons
        self.is_deleted = is_deleted
        self.created_at = created_at if created_at else db.func.current_timestamp()

