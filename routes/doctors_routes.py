from flask import Blueprint, request, session, redirect, url_for, jsonify, render_template
from models import db, Doctor, Appointment, FollowUpMessage, BroadcastMessage
from werkzeug.utils import secure_filename
from datetime import datetime
import os, secrets
import smtplib
from email.mime.text import MIMEText
from flask_login import login_required, current_user



doctor_bp = Blueprint('doctor_bp', __name__)

# === UTILS ===
def generate_token():
    return secrets.token_hex(24)

def send_email(to, subject, html):
    msg = MIMEText(html, 'html')
    msg['Subject'] = subject
    msg['From'] = os.environ.get('SMTP_SENDER', 'noreply@zepusclinics.com')
    msg['To'] = to

    try:
        with smtplib.SMTP(os.environ.get('SMTP_SERVER', 'smtp.mailtrap.io'), int(os.environ.get('SMTP_PORT', 587))) as server:
            server.starttls()
            server.login(os.environ.get('SMTP_USER'), os.environ.get('SMTP_PASS'))
            server.sendmail(msg['From'], [to], msg.as_string())
    except Exception as e:
        print(f"Error sending email: {e}")

# ================
# React: Register
# ================
@doctor_bp.route('/api/doctor/register', methods=['POST'])
def register_doctor():
    try:
        data = request.get_json()
        required_fields = [
            'name', 'dob', 'age', 'sex', 'specialty', 'qualification', 'bio',
            'phone', 'email', 'password', 'address_line', 'city', 'state', 'lga', 'state_of_origin'
        ]
        missing = [field for field in required_fields if not data.get(field)]
        if missing:
            return jsonify({'status': 'fail', 'message': f'Missing fields: {", ".join(missing)}'}), 400

        if Doctor.query.filter_by(email=data['email']).first():
            return jsonify({"status": "fail", "message": "Email already registered"}), 400

        token = generate_token()
        doctor = Doctor(
            name=data.get('name'),
            dob=data.get('dob'),
            age=data.get('age'),
            sex=data.get('sex'),
            specialty=data.get('specialty'),
            qualification=data.get('qualification'),
            bio=data.get('bio'),
            phone=data.get('phone'),
            email=data.get('email'),
            address_line=data.get('address_line'),
            city=data.get('city'),
            state=data.get('state'),
            lga=data.get('lga'),
            state_of_origin=data.get('state_of_origin'),
            email_verification_token=token
        )
        doctor.set_password(data.get('password'))
        db.session.add(doctor)
        db.session.commit()

        confirm_url = f"{request.host_url}api/doctor/confirm/{token}"
        send_email(
            doctor.email,
            "Confirm your ZEPUS Clinics Email",
            f"<p>Dear Dr. {doctor.name},</p><p>Please <a href='{confirm_url}'>click here to confirm your email</a>.</p><p>Thank you.</p>"
        )

        return jsonify({"status": "success", "message": "Registration successful. Please confirm your email."})

    except Exception as e:
        print(f"❌ Doctor registration failed: {e}")
        return jsonify({'status': 'error', 'message': 'Internal server error'}), 500

# ==========================
# Email Confirmation Route
# ==========================
@doctor_bp.route('/api/doctor/confirm/<token>', methods=['GET'])
def confirm_doctor_email(token):
    doctor = Doctor.query.filter_by(email_verification_token=token).first()
    if not doctor:
        return jsonify({"status": "fail", "message": "Invalid or expired token"}), 400

    doctor.email_verified = True
    doctor.email_verification_token = None
    db.session.commit()

    return render_template("email_confirmed.html", user_type="Doctor", name=doctor.name)

# ======================
# Dashboard (HTML View)
# ======================
@doctor_bp.route('/doctor-dashboard')
def doctor_dashboard():
    doctor_id = session.get('doctor_id')
    if not doctor_id:
        return redirect(url_for('doctor_bp.login'))

    doctor = Doctor.query.get(doctor_id)
    appointments = Appointment.query.filter_by(doctor_id=doctor_id).all()
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
    return render_template('doctor_dashboard.html', doctor=doctor, verified=False, message="Documents submitted successfully.")

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

    return jsonify({"reply": f"📨 Auto-reply: Message '{message}' received successfully."})
