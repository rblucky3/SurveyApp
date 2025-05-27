from db import db
from datetime import datetime



class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'))