# services/share_service.py

from flask import Response
from models import Survey
from io import StringIO
import csv


# Generates CSV template for public survey access
def generate_csv_template(key):
    survey = Survey.query.filter_by(public_key=key).first_or_404()
    questions = survey.questions

    si = StringIO()
    writer = csv.writer(si)
    writer.writerow(['question_id', 'question_text', 'answer'])  # Header row

    for q in questions:
        writer.writerow([q.id, q.text, ''])  # One blank answer row per question

    output = Response(si.getvalue(), mimetype='text/csv')
    output.headers['Content-Disposition'] = f'attachment; filename=survey_{key}_template.csv'
    return output
