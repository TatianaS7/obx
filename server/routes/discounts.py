from models.Discount import Discount
from flask import Blueprint, jsonify

discounts = Blueprint('discounts', __name__)

# Get all discounts
@discounts.route('/all', methods=['GET'])
def get_all_discounts():
    try:
        discounts = Discount.query.all()
        serialized_discounts = [discount.serialize() for discount in discounts]
        return jsonify(serialized_discounts), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

# Get discount by ID
@discounts.route('/<int:discount_id>', methods=['GET'])
def get_discount(discount_id):
    try:
        discount = Discount.query.get(discount_id)
        if not discount:
            return jsonify({'message': 'discount not found'}), 404
        return jsonify(discount.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500