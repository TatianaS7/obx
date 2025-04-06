from connection import db

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    blendcard_id = db.Column(db.Integer, db.ForeignKey('blend_card.id'), nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    blendcard = db.relationship('BlendCard', backref='order_items', lazy=True)

    def __init__(self, order_id, blendcard_id, unit_price, quantity):
        self.order_id = order_id
        self.blendcard_id = blendcard_id
        self.unit_price = unit_price
        self.quantity = quantity