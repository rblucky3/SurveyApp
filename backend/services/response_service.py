from db import db
from sqlalchemy import func
from models import Response, Survey, Question

# Save a list of survey responses to the database
def save_response_list(survey_id, user_id, answers):
    for a in answers:
        response = Response(
            survey_id=survey_id,
            question_id=a['question_id'],
            answer=a['answer'],
            user_id=user_id
        )
        db.session.add(response)
    db.session.commit()


# Retrieve all surveys from the database
def get_all_surveys():
    return Survey.query.all()


# Get a summary of responses grouped by question and answer
def get_response_summary(survey_id=None):
    query = db.session.query(
        Question.text.label('question'),
        Response.answer,
        func.count(Response.id).label('count')
    ).join(Question, Response.question_id == Question.id)

    if survey_id:
        query = query.filter(Response.survey_id == survey_id)

    query = query.group_by(Question.text, Response.answer)
    return query.all()


# Process and save responses from a CSV upload
def upload_responses_from_csv(survey_id, reader):
    for row in reader:
        qid = int(row.get('question_id') or row.get('Question ID'))
        ans = row.get('answer') or row.get('Answer')

        response = Response(
            user_id=None,
            survey_id=survey_id,
            question_id=qid,
            answer=ans
        )
        db.session.add(response)
    db.session.commit()
