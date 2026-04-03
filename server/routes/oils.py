from server.models import Oil
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.connection import db
from server._types import OilType

oils = Blueprint('oils', __name__)


# Create an Oil
@oils.route('/create', methods=['POST'])
# @jwt_required()
def create_oil():
    try:
        data = request.get_json()
        oil = Oil(
            name=data['name'],
            description=data['description'],
            origin_country=data.get('origin_country'),
            source=data.get('source'),
            extraction_method=data.get('extraction_method'),
            tags=data.get('tags', []),
            oil_type=OilType(data['oil_type']),
            is_active=data.get('is_active', True),
        )
        db.session.add(oil)
        db.session.commit()
        return jsonify(oil.serialize()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


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
    

# Update an oil
@oils.route('/<int:oil_id>/update', methods=['PUT'])
# @jwt_required()
def update_oil(oil_id):
    try:
        data = request.get_json()
        oil = Oil.query.get(oil_id)
        if not oil:
            return jsonify({'message': 'Oil not found'}), 404

        oil.name = data['name'] if 'name' in data else oil.name
        oil.description = data['description'] if 'description' in data else oil.description
        oil.origin_country = data['origin_country'] if 'origin_country' in data else oil.origin_country
        oil.source = data['source'] if 'source' in data else oil.source
        oil.extraction_method = data['extraction_method'] if 'extraction_method' in data else oil.extraction_method
        oil.tags = data['tags'] if 'tags' in data else oil.tags
        oil.oil_type = OilType(data['oil_type']) if 'oil_type' in data else oil.oil_type
        oil.is_active = data.get('is_active', True) if 'is_active' in data else oil.is_active

        db.session.commit()
        return jsonify(oil.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400