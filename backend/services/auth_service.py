# services/auth_service.py

from flask import jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import User, Team
from db import db


# Registers a new user with hashed password and optional team ID
def register_user(data):
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


# Authenticates a user and returns a JWT token
def login_user(data):
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        token = create_access_token(identity=user.id)
        return jsonify(token=token)
    return jsonify({"msg": "Invalid credentials"}), 401


# Creates a new team entry
def create_team_entry(data):
    name = data['name']

    if Team.query.filter_by(name=name).first():
        return jsonify({'error': 'Team name already exists'}), 400

    team = Team(name=name)
    db.session.add(team)
    db.session.commit()

    return jsonify({'message': 'Team created', 'team_id': team.id})


# Fetches all available teams
def fetch_teams():
    teams = Team.query.all()
    return jsonify([{'id': team.id, 'name': team.name} for team in teams])
