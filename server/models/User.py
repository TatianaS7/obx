from connection import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.string(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15), nullable=True)
    rewards_points = db.Column(db.Integer, default=0)
    is_obx_member = db.Column(db.Boolean, default=False)

    def __init__(self, first_name, last_name, email, password, phone=None, rewards_points=0, is_obx_member=False):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password
        self.phone = phone
        self.rewards_points = rewards_points
        self.is_obx_member = is_obx_member
        