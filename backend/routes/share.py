# routes/share.py

from flask import Blueprint, Response
from services.share_service import generate_csv_template

share_bp = Blueprint("share", __name__)

# Blueprint for public (unauthenticated) access
public_bp = Blueprint("public", __name__)


# Endpoint: Download public survey template as CSV
@public_bp.route("/take/<string:key>", methods=["GET"])
def take_survey_public(key):
    return generate_csv_template(key)








'''



# routes/share.py
from flask import Blueprint, request, jsonify, current_app, url_for,Response
from models import  Survey, User
from db import db
from io import StringIO
import csv
from flask_jwt_extended import jwt_required, get_jwt_identity
import sendgrid, os
from sendgrid.helpers.mail import Mail

share_bp = Blueprint("share", __name__)

# ── 2-c  public access (no JWT) --------------------------------
public_bp = Blueprint("public", __name__)

@public_bp.route("/take/<string:key>", methods=["GET"])
def take_survey_public(key):
    survey = Survey.query.filter_by(public_key=key).first_or_404()
    questions = survey.questions

    si = StringIO()
    writer = csv.writer(si)
    writer.writerow(['question_id', 'question_text', 'answer'])  # Template header

    for q in questions:
        writer.writerow([q.id, q.text, ''])  # Blank answer column

    output = Response(si.getvalue(), mimetype='text/csv')
    output.headers['Content-Disposition'] = f'attachment; filename=survey_{key}_template.csv'
    return output

'''