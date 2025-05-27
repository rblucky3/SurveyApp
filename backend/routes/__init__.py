from .survey_routes import survey_bp
from .response_routes import response_bp
from .auth import auth_bp
from .share import share_bp,public_bp

def init_routes(app):
    app.register_blueprint(survey_bp)
    app.register_blueprint(response_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(share_bp)
    app.register_blueprint(public_bp, url_prefix='/public') 
