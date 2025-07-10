from flask import Blueprint, jsonify, request
from models import db, Doctor, Patient
from datetime import datetime

security_bp = Blueprint('security_bp', __name__, url_prefix='/api/admin/security')

# ========================== Security Alerts ==========================
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


# ====================== Account Lock/Unlock ======================
@security_bp.route('/lock-account/<int:user_id>', methods=['POST'])
def lock_account(user_id):
    user_type = request.args.get('type')
    if user_type == 'doctor':
        doctor = Doctor.query.get(user_id)
        if doctor:
            doctor.is_verified = False
            db.session.commit()
            return jsonify({"success": True, "status": "locked"})
    elif user_type == 'patient':
        patient = Patient.query.get(user_id)
        if patient:
            patient.email_verified = False
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
