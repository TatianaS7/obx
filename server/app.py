from flask_cors import CORS
from flask import Flask, request, jsonify
from connection import db
from flask_jwt_extended import JWTManager
import os
# from seed_data import seedData


def create_app():
    app = Flask(__name__, static_folder='client')
    CORS(app)

    # Configure DB
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET')

    jwt = JWTManager(app)

    db.init_app(app)

    # Import routes
    from routes import auth

    # Register Blueprints
    app.register_blueprint(auth, url_prefix='/api/auth')

    with app.app_context():
        db.drop_all()
        db.create_all()

        # Seed Data
        # seedData()

    return app


app = create_app()


if __name__ == '__main__':
    app.run(debug=True)