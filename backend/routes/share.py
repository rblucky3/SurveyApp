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





