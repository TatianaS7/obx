from flask import Blueprint, jsonify, request
from server.models import User
from server.connection import db
from sqlalchemy import or_
import bcrypt, os
from flask_jwt_extended import create_access_token

JWT_SECRET = os.getenv('JWT_SECRET')  

auth = Blueprint('auth', __name__)


# User Registration
@auth.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        if User.query.filter_by(phone_number=data['phone_number']).first():
            return jsonify({'message': 'User already exists'}), 400
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'User already exists'}), 400
        
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

        new_user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone_number=data['phone_number'],
            password=hashed_password.decode('utf-8')
        )

        db.session.add(new_user)
        db.session.commit()

        serialized_user = new_user.serialize()

        token = create_access_token(serialized_user, JWT_SECRET)

        return jsonify({'success': token, 'user': serialized_user}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

# User Login
@auth.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        identifier = data.get('email') or data.get('phone_number')
        password = data.get('password')

        if not identifier or not password:
            return jsonify({'message': 'Missing credentials'}), 400

        user = User.query.filter(
            or_(
                User.email == data.get('email'),
                User.phone_number == data.get('phone_number')
            )
        ).first()        

        if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return jsonify({'message': 'Invalid credentials'}), 401

        serialized_user = user.serialize()
        token = create_access_token(serialized_user, JWT_SECRET)

        return jsonify({'success': token, 'user': serialized_user}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500