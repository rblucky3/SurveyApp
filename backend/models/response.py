from db import db
from datetime import datetime

class Response(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    survey_id = db.Column(db.Integer, db.ForeignKey('survey.id'))
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'))
    answer = db.Column(db.Text, nullable=False)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)