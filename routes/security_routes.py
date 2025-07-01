from flask import Blueprint, jsonify, request, session
from models import db, Doctor, Patient, Admin
from datetime import datetime

security_bp = Blueprint('security_bp', __name__, url_prefix='/api/admin/security')

# ==========================
# Simulated Security Alerts
# ==========================
security_alerts = [
    {
        "id": 1,
        "title": "Multiple failed login attempts",
        "description": "Patient account had 5 failed logins in 10 minutes.",
        "timestamp": datetime.utcnow(),
        "level": "high",
        "userId": 2,
        "accountType": "patient",
        "accountLocked": False,
    },
    {
        "id": 2,
        "title": "Suspicious consultation request volume",
        "description": "Doctor has requested 12 back-to-back consultations in 5 minutes.",
        "timestamp": datetime.utcnow(),
        "level": "medium",
        "userId": 4,
        "accountType": "doctor",
        "accountLocked": False,
    },
]

@security_bp.route('/alerts', methods=['GET'])
def get_alerts():
    return jsonify({"alerts": security_alerts})


# ======================
# Lock User Accounts
# ======================
@security_bp.route('/lock-account/<int:user_id>', methods=['POST'])
def lock_account(user_id):
    user_type = request.args.get('type')
    if user_type == 'doctor':
        doctor = Doctor.query.get(user_id)
        if doctor:
            doctor.is_verified = False  # Simulate lock by marking unverified
            db.session.commit()
            return jsonify({"success": True, "status": "locked"})
    elif user_type == 'patient':
        patient = Patient.query.get(user_id)
        if patient:
            patient.email_verified = False  # Simulate lock by invalidating login
            db.session.commit()
            return jsonify({"success": True, "status": "locked"})
    return jsonify({"success": False, "message": "User not found or invalid type"}), 404


@security_bp.route('/unlock-account/<int:user_id>', methods=['POST'])
def unlock_account(user_id):
    user_type = request.args.get('type')
    if user_type == 'doctor':
        doctor = Doctor.query.get(user_id)
        if doctor:
            doctor.is_verified = True
            db.session.commit()
            return jsonify({"success": True, "status": "unlocked"})
    elif user_type == 'patient':
        patient = Patient.query.get(user_id)
        if patient:
            patient.email_verified = True
            db.session.commit()
            return jsonify({"success": True, "status": "unlocked"})
    return jsonify({"success": False, "message": "User not found or invalid type"}), 404


# ======================
# Unified Login Route
# ======================
@security_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Admin login
    admin = Admin.query.filter_by(email=email).first()
    if admin and admin.check_password(password):
        session['admin_id'] = admin.id
        session['admin_name'] = admin.name
        return jsonify({'message': 'Admin login successful', 'role': 'admin'}), 200

    # Doctor login
    doctor = Doctor.query.filter_by(email=email).first()
    if doctor and doctor.check_password(password):
        if not doctor.is_verified:
            return jsonify({'message': 'Doctor account pending verification'}), 403
        session['doctor_id'] = doctor.id
        return jsonify({'message': 'Doctor login successful', 'role': 'doctor'}), 200

    # Patient login
    patient = Patient.query.filter_by(email=email).first()
    if patient and patient.check_password(password):
        session['patient_id'] = patient.id
        return jsonify({'message': 'Patient login successful', 'role': 'patient'}), 200

    return jsonify({'message': 'Invalid credentials'}), 401
@security_bp.route('/api/logout', methods=['POST'])
def logout():
    session_keys = ['admin_id', 'admin_name', 'doctor_id', 'patient_id']
    for key in session_keys:
        session.pop(key, None)
    return jsonify({'message': 'Successfully logged out'}), 200
