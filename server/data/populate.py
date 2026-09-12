from server.models import Oil, Discount, BlendCard, BlendCardOil
from server.connection import db
from server._types import (
    ProductUsage,
    ProductType,
    BlendCategory,
    BottleSize,
    BottleType,
    OilType,
)
import json

OIL_DENSITY_G_PER_ML = 0.92


def populate_oils():
    try:
        with open('server/data/oils_data.json', 'r') as file:
            oils_data = json.load(file)
            for oil_data in oils_data:
                oil = Oil(
                    name=oil_data['name'],
                    description=oil_data['description'],
                    origin_country=oil_data.get('origin_country'),
                    source=oil_data.get('source'),
                    extraction_method=oil_data.get('extraction_method'),
                    tags=oil_data.get('tags', []),
                    oil_type=oil_data['oil_type'],
                    product_usage=ProductUsage(oil_data.get('product_usage', ProductUsage.BOTH.value)),
                    is_active=oil_data['is_active']
                )
                db.session.add(oil)
            db.session.commit()

            print("Oils populated successfully.")
    except Exception as e:
        print(f"Error populating oils: {e}")

def populate_premade_blends():
    try:
        with open('server/data/premade_blends.json', 'r') as file:
            premade_blends_data = json.load(file)
            for blend_data in premade_blends_data:
                oils = blend_data.get('oils', [])
                size = BottleSize(blend_data['bottle_size'])
                total_grams = round(size.to_ml() * OIL_DENSITY_G_PER_ML, 2)
                per_oil_amount = round(total_grams / max(len(oils), 1), 2)

                blend = BlendCard(
                    created_by=None,
                    name=blend_data['name'],
                    description=blend_data['description'],
                    product_type=ProductType(blend_data['product_type']),
                    category=BlendCategory(blend_data['category']),
                    bottle_size=size,
                    bottle_type=BottleType(blend_data['bottle_type']),
                    is_deleted=blend_data.get('is_deleted', blend_data.get('is_delete', False)),
                    is_premade=blend_data.get('is_premade', True),
                )
                db.session.add(blend)
                db.session.flush()

                for oil_data in oils:
                    oil_id = oil_data.get('oil_id', oil_data.get('id'))
                    if oil_id is None:
                        continue

                    oil = Oil.query.get(oil_id)
                    if not oil:
                        # Skip unknown oil IDs so one bad reference does not block the entire seed.
                        continue

                    blend_oil = BlendCardOil(
                        blend_card_id=blend.id,
                        oil_id=oil_id,
                        oil_type=OilType(oil_data.get('oil_type', oil.oil_type.value)),
                        amount=per_oil_amount,
                    )
                    db.session.add(blend_oil)

            db.session.commit()

            print("Premade blends populated successfully.")
    except Exception as e:
        print(f"Error populating premade blends: {e}")


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
