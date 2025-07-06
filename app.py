# app.py

from flask import Flask, send_from_directory
import os
from config import Config
from models import db, bcrypt

# Import blueprints
from routes.doctors_routes import doctor_bp
from routes.patients_routes import patient_bp
from routes.admin_routes import admin_bp
from routes.ledger_routes import ledger_bp
from routes.bank_routes import bank_bp
from routes.security_routes import security_bp
from routes.support_routes import support_bp
from routes.system_status_routes import system_status_bp
from routes.audit_routes import audit_bp
from routes.notifications_routes import notifications_bp
from routes.settings_routes import settings_bp
from routes.analytics_routes import analytics_bp

# ✅ Correct Vite build folder: client_frontend/static
REACT_BUILD_DIR = os.path.join(os.path.dirname(__file__), 'client_frontend', 'static')

app = Flask(
    __name__,
    static_folder=os.path.join(REACT_BUILD_DIR, 'assets'),
    template_folder=REACT_BUILD_DIR
)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
bcrypt.init_app(app)

# Register blueprints
app.register_blueprint(doctor_bp)
app.register_blueprint(patient_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(ledger_bp)
app.register_blueprint(bank_bp)
app.register_blueprint(security_bp)
app.register_blueprint(support_bp)
app.register_blueprint(system_status_bp)
app.register_blueprint(audit_bp)
app.register_blueprint(notifications_bp)
app.register_blueprint(settings_bp)
app.register_blueprint(analytics_bp)

# Auto-create tables
with app.app_context():
    db.create_all()

# ✅ Serve React frontend correctly
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    file_path = os.path.join(REACT_BUILD_DIR, path)
    if path and os.path.exists(file_path):
        return send_from_directory(REACT_BUILD_DIR, path)
    return send_from_directory(REACT_BUILD_DIR, 'index.html')

# Run server
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5055)
