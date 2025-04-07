from connection import db
from enum import Enum
from _types import OilType


class BlendCardOil(db.Model):
    __tablename__ = 'blend_card_oil'

    id = db.Column(db.Integer, primary_key=True)
    blend_card_id = db.Column(db.Integer, db.ForeignKey('blend_card.id'), nullable=False)
    oil_id = db.Column(db.Integer, db.ForeignKey('oil.id'), nullable=False)

    oil_type = db.Column(db.Enum(OilType), nullable=False)
    amount = db.Column(db.Float, nullable=False)

    oil = db.relationship('Oil')

    def __init__(self, blend_card_id, oil_id, oil_type, amount):
        self.blend_card_id = blend_card_id
        self.oil_id = oil_id
        self.oil_type = oil_type
        self.amount = amount

    def serialize(self):
        return {
            'id': self.id,
            'blend_card_id': self.blend_card_id,
            'oil_id': self.oil_id,
            'oil_type': self.oil_type.value,
            'amount': self.amount,
            'oil': self.oil.serialize() if self.oil else None
        }