from models.Oil import Oil
from flask import Blueprint, jsonify

oils = Blueprint('oils', __name__)

# Get all oils
@oils.route('/all', methods=['GET'])
def get_all_oils():
    try:
        oils = Oil.query.all()
        return jsonify([oil.serialize() for oil in oils]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

# Get oil by ID
@oils.route('/<int:oil_id>', methods=['GET'])
def get_oil(oil_id):
    try:
        oil = Oil.query.get(oil_id)
        if not oil:
            return jsonify({'message': 'Oil not found'}), 404
        return jsonify(oil.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500