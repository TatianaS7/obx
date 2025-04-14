from ..connection import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(15), nullable=False, unique=True)
    rewards_points = db.Column(db.Integer, default=0)
    is_employee = db.Column(db.Boolean, default=False)
    birthday = db.Column(db.Date, nullable=True)

    def __init__(self, first_name, last_name, email, password, phone_number, rewards_points=0, is_employee=False, birthday=None):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password
        self.phone_number = phone_number
        self.rewards_points = rewards_points
        self.is_employee = is_employee
        self.birthday = birthday

    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone_number': self.phone_number,
            'rewards_points': self.rewards_points,
            'is_employee': self.is_employee,
            'birthday': self.birthday.isoformat() if self.birthday else None
        }
        