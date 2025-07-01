from flask import Blueprint, render_template, request, session, redirect, url_for, jsonify
from models import db, Doctor, Appointment, FollowUpMessage, BroadcastMessage
from werkzeug.utils import secure_filename
from datetime import datetime
import os

from flask_login import login_required, current_user

doctor_bp = Blueprint('doctor_bp', __name__)

@doctor_bp.context_processor
def inject_now():
    return {'now': datetime.now()}

# ======================
# Doctor Dashboard Route
# ======================
@doctor_bp.route('/doctor-dashboard')
def doctor_dashboard():
    doctor_id = session.get('doctor_id')
    if not doctor_id:
        return redirect(url_for('doctor_bp.login'))

    doctor = Doctor.query.get(doctor_id)
    appointments = Appointment.query.filter_by(doctor_id=doctor_id).all()

    # Get latest relevant broadcast
    latest_broadcast = BroadcastMessage.query.filter(
        (BroadcastMessage.target_group == 'doctors') | (BroadcastMessage.target_group == 'all')
    ).order_by(BroadcastMessage.created_at.desc()).first()

    return render_template(
        'doctor_dashboard.html',
        doctor=doctor,
        appointments=appointments,
        verified=doctor.is_verified,
        latest_broadcast=latest_broadcast
    )

# =========================
# Upload Verification Docs
# =========================
@doctor_bp.route('/upload-documents', methods=['POST'])
def upload_documents():
    doctor_id = session.get('doctor_id')
    if not doctor_id:
        return redirect(url_for('doctor_bp.login'))

    doctor = Doctor.query.get(doctor_id)

    def save_file(field_name):
        file = request.files.get(field_name)
        if file and file.filename:
            filename = secure_filename(file.filename)
            folder = 'static/doctor_verification_uploads'
            os.makedirs(folder, exist_ok=True)
            path = os.path.join(folder, f"{doctor_id}_{field_name}_{filename}")
            file.save(path)
            return path
        return None

    doctor.license_path = save_file('license')
    doctor.gov_id_path = save_file('gov_id')
    doctor.specialty_cert_path = save_file('specialty_cert')
    doctor.photo_path = save_file('photo')
    doctor.cv_path = save_file('cv')

    db.session.commit()

    return render_template('doctor_dashboard.html', doctor=doctor, verified=False, message="Documents submitted successfully. Awaiting admin approval.")

# ====================
# Send Follow-up Note
# ====================
@doctor_bp.route('/send-followup', methods=['POST'])
def send_followup():
    doctor_id = session.get('doctor_id')
    if not doctor_id:
        return jsonify({'status': 'fail', 'message': 'Not logged in'})

    data = request.form
    message = FollowUpMessage(
        doctor_id=doctor_id,
        patient_id=data['patient_id'],
        subject=data['subject'],
        body=data['body']
    )
    db.session.add(message)
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Follow-up sent'})

# ==============================
# API: Doctor Dashboard (React)
# ==============================
@doctor_bp.route('/api/doctor/dashboard', methods=['GET'])
def api_doctor_dashboard():
    doctor_id = session.get('doctor_id')
    if not doctor_id:
        return jsonify({"error": "Unauthorized"}), 401

    doctor = Doctor.query.get(doctor_id)
    appointments = Appointment.query.filter_by(doctor_id=doctor_id).all()
    latest_broadcast = BroadcastMessage.query.filter(
        (BroadcastMessage.target_group == 'doctors') | (BroadcastMessage.target_group == 'all')
    ).order_by(BroadcastMessage.created_at.desc()).first()

    return jsonify({
        "doctor": doctor.to_dict(),
        "appointments": [appt.to_dict() for appt in appointments],
        "latest_broadcast": latest_broadcast.to_dict() if latest_broadcast else None
    })

# =============================
# API: Doctor Chat (React)
# =============================
@doctor_bp.route('/api/doctor/chat', methods=['POST'])
def api_doctor_chat():
    doctor_id = session.get('doctor_id')
    if not doctor_id:
        return jsonify({"reply": "Not authorized"}), 401

    data = request.get_json()
    message = data.get("message", "").strip()

    if not message:
        return jsonify({"reply": "Empty message received"}), 400

    # Placeholder logic for testing (can be replaced with LLM or patient routing)
    response = f"📨 Auto-reply: Message '{message}' received successfully."

    return jsonify({"reply": response})
