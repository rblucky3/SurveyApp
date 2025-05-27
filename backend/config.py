import os
import secrets
#print(secrets.token_hex(32))

class Config:
    SECRET_KEY = "super-secret"
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:password123@localhost/levosurveydb')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = 'uploads/'
    JWT_SECRET_KEY = "96118248fb00bcaa9d466b2707da012eeac8569646ed158165d120ad87913c31"

    # Flask-Mail Configuration
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'senderemailid'
    MAIL_PASSWORD = 'senderemailpassword'
    MAIL_DEFAULT_SENDER = 'senderemailid'  
