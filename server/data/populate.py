from models import Oil, Discount
from datetime import datetime
from connection import db
import json


def populate_oils():
    try:
        with open('server/data/oils_data.json', 'r') as file:
            oils_data = json.load(file)
            for oil_data in oils_data:
                oil = Oil(
                    name=oil_data['name'],
                    description=oil_data['description'],
                    oil_type=oil_data['oil_type'],
                    is_active=oil_data['is_active']
                )
                db.session.add(oil)
            db.session.commit()

            print("Oils populated successfully.")
    except Exception as e:
        print(f"Error populating oils: {e}")


def populate_discounts():
    try:
        with open('server/data/discounts_data.json', 'r') as file:
            discounts_data = json.load(file)
            for discount_data in discounts_data:
                discount = Discount(
                    name=discount_data['name'],
                    code=discount_data['code'],
                    description=discount_data['description'],
                    percentage_off=discount_data['percentage_off'],
                    is_active=discount_data['is_active'],
                    expires_at=discount_data['expires_at'] if discount_data['expires_at'] else None,
                )
                db.session.add(discount)
            db.session.commit()

            print("Discounts populated successfully.")
    except Exception as e:
        print(f"Error populating discounts: {e}")
