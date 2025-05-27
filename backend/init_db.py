from app import app
from db import db
import models  # Ensures models are registered

with app.app_context():
    db.create_all()
    print("✅ Database tables created.")