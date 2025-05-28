
# app.py
from flask import Flask
from config import Config
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from extensions import mail
from db import db

# Initialize Flask app and load configuration
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
mail.init_app(app)                # Initialize Flask-Mail
CORS(app)                         # Enable CORS
JWTManager(app)                   # Setup JWT authentication
db.init_app(app)                  # Setup SQLAlchemy
migrate = Migrate(app, db)        # Setup Flask-Migrate


# Load models after initializing db (for migrations to detect them)
with app.app_context():
    from models import *          # Import all models


# Register all routes via a centralized route initializer
from routes import init_routes
init_routes(app)                  # Register Blueprints


# Define a simple health check route
@app.route('/')
def home():
    return "Survey Backend running"


# Start the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()           # Ensure tables exist on startup
        print("Tables created.")
    app.run(debug=True)           # Run the app in debug mode



