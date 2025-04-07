from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import BlendCard, BlendCardOil
from _types import ProductType, BlendCategory, BottleSize, BottleType, OilType
from connection import db

blend_cards = Blueprint('blend_cards', __name__)


# Create a Blend Card
@blend_cards.route('/create', methods=['POST'])
# @jwt_required()
def create_blend_card():
    try:
        data = request.get_json()
        # user_id = get_jwt_identity()

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

        for oil in data['oils']:
            oil_entry = BlendCardOil(
                blend_card_id=blend_card.id,
                oil_id=oil['oil_id'],
                oil_type=OilType(oil['oil_type']),
                amount=oil['amount'],
            )
            db.session.add(oil_entry)
        db.session.commit()

        return jsonify(blend_card.serialize()), 201
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
