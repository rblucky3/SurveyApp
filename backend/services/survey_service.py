from flask import jsonify, url_for, current_app
from flask_mail import Message
from models import Survey, Question, Response
from db import db
from extensions import mail


def create_survey(data, user_id):
    """
    Create survey and related questions.
    """
    survey = Survey(
        title=data['title'],
        description=data['description'],
        created_by=user_id,
        public_key=data.get('public_key')
    )
    db.session.add(survey)
    db.session.flush()

    for q in data['questions']:
        question = Question(
            text=q['text'],
            type=q['type'],
            options=q.get('options'),
            survey_id=survey.id
        )
        db.session.add(question)

    db.session.commit()
    return jsonify({"message": "Survey created", "survey_id": survey.id})


def get_survey_by_id(survey_id):
    """
    Get survey details and questions by ID.
    """
    survey = Survey.query.get_or_404(survey_id)
    return jsonify({
        "id": survey.id,
        "title": survey.title,
        "description": survey.description,
        "questions": [
            {"id": q.id, "text": q.text, "type": q.type, "options": q.options}
            for q in survey.questions
        ]
    })


def distribute_survey_via_email(data):
    """
    Send survey link via email.
    """
    from routes.share import public_bp  # avoid circular import

    survey_id = data.get('survey_id')
    email = data.get('email')

    if not survey_id or not email:
        return jsonify({'error': 'Survey ID and recipient email required'}), 400

    survey = Survey.query.get(survey_id)
    if not survey:
        return jsonify({'error': 'Survey not found'}), 404

    if not survey.public_key:
        return jsonify({'error': 'Survey does not have a public link'}), 400

    # Generate public link
    survey_link = url_for('public.get_public_survey', key=survey.public_key, _external=True)
    subject = f"Please take the survey: {survey.title}"
    body = f"""Hi,\n\nYou've been invited to take the survey titled "{survey.title}".\n\nClick the link below to start:\n{survey_link}\n\nThank you!"""

    try:
        msg = Message(subject=subject, recipients=[email], body=body)
        mail.send(msg)
        return jsonify({'message': 'Survey email sent successfully'}), 200
    except Exception as e:
        current_app.logger.error(f"Email send failed: {e}")
        return jsonify({'error': 'Failed to send email'}), 500


def submit_response(data, user_id):
    """
    Store user responses to the survey.
    """
    for answer in data['answers']:
        response = Response(
            user_id=user_id,
            survey_id=data['survey_id'],
            question_id=answer['question_id'],
            answer=answer['answer']
        )
        db.session.add(response)

    db.session.commit()
    return jsonify({"message": "Responses submitted"})


def get_survey_by_public_key(key):
    """
    Publicly fetch a survey via its public key.
    """
    survey = Survey.query.filter_by(public_key=key).first_or_404()
    return jsonify({
        "id": survey.id,
        "title": survey.title,
        "questions": [
            {
                "id": q.id,
                "text": q.text,
                "type": q.type,
                "options": q.options.split(",") if q.options else []
            } for q in survey.questions
        ]
    })



'''


from db import db
from models.survey import Survey, Question
from utils import parse_csv

def create_survey_with_questions(data):
    survey = Survey(title=data['title'], description=data.get('description', ''))
    db.session.add(survey)
    for q in data['questions']:
        question = Question(
            survey=survey,
            question_text=q['question_text'],
            question_type=q['question_type'],
            options=q.get('options')
        )
        db.session.add(question)
    db.session.commit()
    return {'survey_id': survey.id}

def parse_csv_and_create_survey(file, title, description):
    questions = parse_csv(file)
    survey_data = {'title': title, 'description': description, 'questions': questions}
    return create_survey_with_questions(survey_data)

def get_survey_details(survey_id):
    survey = Survey.query.get(survey_id)
    return {
        'id': survey.id,
        'title': survey.title,
        'description': survey.description,
        'questions': [
            {
                'id': q.id,
                'question_text': q.question_text,
                'question_type': q.question_type,
                'options': q.options
            } for q in survey.questions
        ]
    }

    

'''