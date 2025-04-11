from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import BlendCard, BlendCardOil
from _types import ProductType, BlendCategory, BottleSize, BottleType, OilType
from connection import db
from utils import calculate_volume
from marshmallow.exceptions import ValidationError

blend_cards = Blueprint('blend_cards', __name__)


# Create a Blend Card
@blend_cards.route('/create', methods=['POST'])
# @jwt_required()
def create_blend_card():
    try:
        data = request.get_json()
        # user_id = get_jwt_identity()

        ingredients = {
            "base_oil": [oil["oil_id"] for oil in data['oils'] if oil["oil_type"] == OilType.BASE.value],
            "secondary_oil": [oil["oil_id"] for oil in data['oils'] if oil["oil_type"] == OilType.SECONDARY.value],
            "add_on_oil": [oil["oil_id"] for oil in data['oils'] if oil["oil_type"] == OilType.OTHER.value or oil["oil_type"] == OilType.PREMIUM.value]
        }

        # Validate the blend card
        volume_result = calculate_volume(
            ingredients,
            BottleSize[data['bottle_size']].value,
            BottleType[data['bottle_type']].value,
            BlendCategory[data['category']].value
        )

        blend_card = BlendCard(
            created_by=1,
            name=data['name'],
            description=data['description'],
            product_type=ProductType(data['product_type']),
            category=BlendCategory(data['category']),
            bottle_size=BottleSize[data['bottle_size']],
            bottle_type=BottleType(data['bottle_type']),
            is_deleted=data.get('is_deleted', False),
        )   
        db.session.add(blend_card)
        db.session.flush()

        base_amount = volume_result["base_volume"] / len(ingredients['base_oil']) if ingredients['base_oil'] else 0
        secondary_amount = volume_result["secondary_volume"] / len(ingredients['secondary_oil']) if ingredients['secondary_oil'] else 0
        add_on_amount = volume_result["add_on_volume"] / len(ingredients['add_on_oil']) if ingredients['add_on_oil'] else 0

        # Loop through oils and assign calculated amounts
        for oil in data['oils']:
            oil_type = OilType(oil['oil_type'])

            if oil_type == OilType.BASE:
                amount = base_amount
            elif oil_type == OilType.SECONDARY:
                amount = secondary_amount
            else:
                amount = add_on_amount

            oil_entry = BlendCardOil(
                blend_card_id=blend_card.id,
                oil_id=oil['oil_id'],
                oil_type=oil_type,
                amount=amount,
            )
            db.session.add(oil_entry)
        db.session.commit()

        return jsonify(blend_card.serialize()), 201
    except ValidationError as ve:
        return jsonify({"validation_error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

# Get all Blend Cards
@blend_cards.route('/all', methods=['GET'])
def get_all_blend_cards():
    try:
        blend_cards = BlendCard.query.all()
        if not blend_cards:
            return jsonify({"message": "No blend cards found"}), 404
        return jsonify([blend_card.serialize() for blend_card in blend_cards]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

# Get a Blend Card by ID
@blend_cards.route('/<int:blend_card_id>', methods=['GET'])
def get_blend_card(blend_card_id):
    try:
        blend_card = BlendCard.query.get(blend_card_id)
        if not blend_card:
            return jsonify({"message": "Blend card not found"}), 404
        return jsonify(blend_card.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
