from flask import Blueprint, request, jsonify, current_app, url_for
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message
from extensions import mail
from routes.share import public_bp
from services import survey_service

survey_bp = Blueprint('survey', __name__, url_prefix='/api')

# Create a new survey
@survey_bp.route('/surveys', methods=['POST'])
def create_survey():
    data = request.json
    user_id = 1  # Replace with get_jwt_identity() if using JWT
    try:
        survey_id = survey_service.create_survey(data, user_id)
        return jsonify({"message": "Survey created", "survey_id": survey_id})
    except Exception as e:
        return jsonify({"error": "Failed to create survey", "details": str(e)}), 500

# Get full details of a specific survey
@survey_bp.route('/survey/<int:survey_id>', methods=['GET'])
def get_survey(survey_id):
    survey = survey_service.get_survey_by_id(survey_id)
    if not survey:
        return jsonify({"error": "Survey not found"}), 404
    
    return jsonify(survey)
    return jsonify({
        "id": survey.id,
        "title": survey.title,
        "description": survey.description,
        "questions": [
            {"id": q.id, "text": q.text, "type": q.type, "options": q.options}
            for q in survey.questions
        ]
    })

# Distribute a survey via email (with public key)
@survey_bp.route('/surveys/distribute', methods=['POST'])
def distribute_survey():
    data = request.get_json()
    survey_id = data.get('survey_id')
    email = data.get('email')

    if not survey_id or not email:
        return jsonify({'error': 'Survey ID and recipient email required'}), 400

    survey = survey_service.get_survey_model_by_id(survey_id)
    if not survey.public_key:
        return jsonify({'error': 'Survey does not have a public link'}), 400

    # Generate public survey link
    survey_link = url_for('public.get_public_survey', key=survey.public_key, _external=True)

    subject = f"Please take the survey: {survey.title}"
    body = f"""Hi,\n\nYou've been invited to take the survey titled \"{survey.title}\".\n\nClick below to start:\n{survey_link}\n\nThank you!"""

    try:
        msg = Message(subject=subject, recipients=[email], body=body)
        mail.send(msg)
        return jsonify({'message': 'Survey email sent successfully'}), 200
    except Exception as e:
        current_app.logger.error(f"Email send failed: {e}")
        return jsonify({'error': 'Failed to send email'}), 500

# Submit a response to a survey (in-app)
@survey_bp.route('/submit-response', methods=['POST'])
@jwt_required()
def submit_response():
    data = request.json
    user_id = get_jwt_identity()
    try:
        survey_service.submit_survey_responses(user_id, data['survey_id'], data['answers'])
        return jsonify({"message": "Responses submitted"})
    except Exception as e:
        return jsonify({"error": "Failed to submit responses", "details": str(e)}), 500

# Public access to survey using public key (no auth)
@public_bp.route("/take/<string:key>", methods=["GET"])
def get_public_survey(key):
    survey = survey_service.get_survey_by_public_key(key)
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


