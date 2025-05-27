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




'''


from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import User,Team
from db import db


auth_bp = Blueprint('auth', __name__,url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data['email']
    password = data['password']
    team_id = data.get('team_id')

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    hashed_pw = generate_password_hash(password)
    user = User(email=email, password=hashed_pw, team_id=team_id)
    db.session.add(user)
    db.session.commit()
    
    token = create_access_token(identity=user.id)
    return jsonify(token=token)
#return jsonify({'message': 'User registered successfully'})


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        token = create_access_token(identity=user.id)
        return jsonify(token=token)
    return jsonify({"msg": "Invalid credentials"}), 401


@auth_bp.route('/teams', methods=['POST'])
def create_team():
    data = request.json
    name = data['name']

    if Team.query.filter_by(name=name).first():
        return jsonify({'error': 'Team name already exists'}), 400

    team = Team(name=name)
    db.session.add(team)
    db.session.commit()

    return jsonify({'message': 'Team created', 'team_id': team.id})

@auth_bp.route('/teams', methods=['GET'])
def get_teams():
    teams = Team.query.all()
    return jsonify([
        {'id': team.id, 'name': team.name}
        for team in teams
    ])

    '''
