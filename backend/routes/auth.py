# routes/auth.py

from flask import Blueprint, request, jsonify
from services.auth_service import register_user, login_user, create_team_entry, fetch_teams

# Define the auth blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Register a new user
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    return register_user(data)

# Login an existing user
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    return login_user(data)

# Create a new team
@auth_bp.route('/teams', methods=['POST'])
def create_team():
    data = request.json
    return create_team_entry(data)

# Get all existing teams
@auth_bp.route('/teams', methods=['GET'])
def get_teams():
    return fetch_teams()

