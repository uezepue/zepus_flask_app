import os
import logging
from flask import Flask, send_from_directory
import eventlet
eventlet.monkey_patch()

from flask_socketio import SocketIO
from flask.cli import with_appcontext
from config import Config
from models import db, bcrypt

# CLI seed script
from script.seed_test_users import seed_test_users

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
from routes.auth_routes import auth_bp

from mimetypes import guess_type

# Setup base paths
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
CLIENT_STATIC = os.path.join(BASE_DIR, 'client_frontend', 'static')
ADMIN_STATIC = os.path.join(BASE_DIR, 'admin_frontend', 'static')

# Initialize Flask
app = Flask(__name__, static_folder=None)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
bcrypt.init_app(app)
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
app.register_blueprint(auth_bp)


# Auto-create tables
with app.app_context():
    db.create_all()

# Register custom CLI commands
app.cli.add_command(seed_test_users)

# ✅ Serve Admin static files
@app.route('/admin', defaults={'path': ''})
@app.route('/admin/<path:path>')
def serve_admin(path):
    full_path = os.path.join(ADMIN_STATIC, path)
    if path and os.path.exists(full_path):
        mime, _ = guess_type(full_path)
        return send_from_directory(ADMIN_STATIC, path, mimetype=mime)
    return send_from_directory(ADMIN_STATIC, 'index.html')

# ✅ Serve Client static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_client(path):
    # Prevent admin paths from falling through
    if path.startswith('admin'):
        return send_from_directory(ADMIN_STATIC, 'index.html')

    full_path = os.path.join(CLIENT_STATIC, path)
    if path and os.path.exists(full_path):
        mime, _ = guess_type(full_path)
        return send_from_directory(CLIENT_STATIC, path, mimetype=mime)
    return send_from_directory(CLIENT_STATIC, 'index.html')

# ✅ Entry point
if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    socketio.run(app, debug=True, host='0.0.0.0', port=5055)
