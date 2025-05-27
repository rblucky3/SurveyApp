from flask import Blueprint, request, jsonify
from services import response_service
from io import StringIO
import csv

# Define Blueprint for response-related routes
response_bp = Blueprint('response', __name__, url_prefix='/api/responses')


# Route to submit survey responses (JSON format)
@response_bp.route('', methods=['POST'])
def submit_response():
    data = request.get_json()
    user_id = 1  # Replace with get_jwt_identity() if using JWT auth
    survey_id = data.get('survey_id')
    answers = data.get('answers')

    try:
        response_service.save_response_list(survey_id, user_id, answers)
        return jsonify({"message": "Responses saved successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route to fetch all surveys
@response_bp.route('/surveys', methods=['GET'])
def get_surveys():
    surveys = response_service.get_all_surveys()
    return jsonify([{'id': s.id, 'title': s.title} for s in surveys])


# Route to get response summary by question/answer
@response_bp.route('/responses-summary', methods=['GET'])
def responses_summary():
    survey_id = request.args.get('survey_id', type=int)
    summary = response_service.get_response_summary(survey_id)
    result = [{'question': q, 'answer': a, 'count': c} for q, a, c in summary]
    return jsonify(result)


# Route to upload survey responses via CSV file
@response_bp.route('/upload-csv', methods=['POST'])
def upload_responses_csv():
    survey_id = request.args.get('survey_id')
    if not survey_id:
        return jsonify({'error': 'Survey ID required'}), 400

    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'CSV file required'}), 400

    try:
        # Read CSV file
        stream = StringIO(file.stream.read().decode("UTF8"), newline=None)
        reader = csv.DictReader(stream)

        # Ensure required fields are present
        required_fields = {'question_id', 'answer'}
        if not required_fields.issubset(set(map(str.lower, reader.fieldnames))):
            return jsonify({'error': 'Invalid CSV format: question_id and answer are required.'}), 400

        # Process and save each row
        response_service.upload_responses_from_csv(survey_id, reader)
        return jsonify({'message': 'Responses uploaded successfully'}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to upload responses', 'details': str(e)}), 500










'''

from flask import Blueprint, request, jsonify
from services.response_service import save_responses
from db import db
from models import Survey,Response, Response as ResponseAnswer
from routes.share import public_bp
from sqlalchemy import func
from models import Question
import csv
from io import StringIO


response_bp = Blueprint('response', __name__, url_prefix='/api/responses')

@response_bp.route('', methods=['POST'])
def submit_response():
    data = request.get_json()
    user_id = 1 # get_jwt_identity()
    survey_id = data.get('survey_id')
    answers = data.get('answers')

    for a in answers:
        response = Response(
            survey_id=survey_id,
            question_id=a['question_id'],
            answer=a['answer'],
            user_id=user_id
        )
        db.session.add(response)

    db.session.commit()
    return jsonify({"message": "Responses saved successfully"}), 201

@response_bp.route('/surveys', methods=['GET'])
#@jwt_required()
def get_surveys():
    surveys = Survey.query.all()
    return jsonify([{'id': s.id, 'title': s.title} for s in surveys])



@response_bp.route('/responses-summary', methods=['GET'])
#@jwt_required()
def responses_summary():
    survey_id = request.args.get('survey_id', type=int)
    query = db.session.query(
        Question.text.label('question'),
        Response.answer,
        db.func.count(Response.id).label('count')
    ).join(Question, Response.question_id == Question.id)

    if survey_id:
        query = query.filter(Response.survey_id == survey_id)

    query = query.group_by(Question.text, Response.answer)

    summary = query.all()
    result = [{'question': q, 'answer': a, 'count': c} for q, a, c in summary]
    return jsonify(result)


@response_bp.route('/upload-csv', methods=['POST'])
#@jwt_required(optional=True)  # Optional for anonymous uploads
def upload_responses_csv():
    survey_id = request.args.get('survey_id')
    if not survey_id:
        return jsonify({'error': 'Survey ID required'}), 400

    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'CSV file required'}), 400

    try:
        stream = StringIO(file.stream.read().decode("UTF8"), newline=None)
        reader = csv.DictReader(stream)

        required_fields = {'question_id', 'answer'}
        if not required_fields.issubset(set(map(str.lower, reader.fieldnames))):
            return jsonify({'error': 'Invalid CSV format: question_id and answer are required.'}), 400

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
        return jsonify({'message': 'Responses uploaded successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to upload responses'}), 500

'''

