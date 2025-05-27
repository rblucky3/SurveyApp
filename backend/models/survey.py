from db import db
import uuid

class Survey(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    questions = db.relationship('Question', backref='survey', cascade='all, delete-orphan')
    public_key = db.Column(db.String(36), default=lambda: str(uuid.uuid4()), unique=True)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(300))
    type = db.Column(db.String(50))  # e.g., 'text', 'mcq', 'rating'
    options = db.Column(db.ARRAY(db.String), nullable=True)  # for MCQs
    survey_id = db.Column(db.Integer, db.ForeignKey('survey.id'))