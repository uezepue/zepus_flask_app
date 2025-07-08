from flask import Flask, send_from_directory
import os
import eventlet
eventlet.monkey_patch()

from flask_socketio import SocketIO
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

# Setup frontend paths
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
CLIENT_BUILD_DIR = os.path.join(BASE_DIR, 'client_frontend', 'static')
ADMIN_BUILD_DIR = os.path.join(BASE_DIR, 'admin_frontend', 'static')

# Initialize Flask app (no static_folder or template_folder here)
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
bcrypt.init_app(app)

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

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

# Serve admin frontend
@app.route('/admin', defaults={'path': ''})
@app.route('/admin/<path:path>')
def serve_admin(path):
    target_file = os.path.join(ADMIN_BUILD_DIR, path)
    if path and os.path.exists(target_file):
        return send_from_directory(ADMIN_BUILD_DIR, path)
    return send_from_directory(ADMIN_BUILD_DIR, 'index.html')

# Serve client frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_client(path):
    # If someone tries /admin/* but hits this route, send them to admin instead
    if path.startswith('admin'):
        return send_from_directory(ADMIN_BUILD_DIR, 'index.html')

    target_file = os.path.join(CLIENT_BUILD_DIR, path)
    if path and os.path.exists(target_file):
        return send_from_directory(CLIENT_BUILD_DIR, path)
    return send_from_directory(CLIENT_BUILD_DIR, 'index.html')

# Run the app
if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5055)
