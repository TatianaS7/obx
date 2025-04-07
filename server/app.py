from flask_cors import CORS
from flask import Flask, request, jsonify
from connection import db
from flask_jwt_extended import JWTManager
import os


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
    from routes import auth, oils, discounts, blend_cards

    # Register Blueprints
    app.register_blueprint(auth, url_prefix='/api/auth')
    app.register_blueprint(oils, url_prefix='/api/oils')
    app.register_blueprint(discounts, url_prefix='/api/discounts')
    app.register_blueprint(blend_cards, url_prefix='/api/blend_cards')

    with app.app_context():
        db.drop_all()
        db.create_all()

        # Populate database with initial data
        from data.populate import populate_oils, populate_discounts
        populate_oils()
        populate_discounts()

    return app


app = create_app()


if __name__ == '__main__':
    app.run(debug=True)