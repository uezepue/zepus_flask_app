from flask import Blueprint, render_template, request, session, redirect, url_for, jsonify
from models import db, Patient, Appointment, Doctor, LedgerEntry, BroadcastMessage, FollowUpMessage
from werkzeug.utils import secure_filename
import os
from datetime import datetime

patient_bp = Blueprint('patient', __name__, url_prefix='/patient')

@patient_bp.route('/dashboard')
def dashboard():
    patient_id = session.get('patient_id')
    if not patient_id:
        return redirect(url_for('patient.dashboard'))

    patient = Patient.query.get(patient_id)
    doctors = Doctor.query.filter_by(is_verified=True).all()
    appointments = Appointment.query.filter_by(patient_id=patient_id).all()
    transactions = LedgerEntry.query.filter_by(source='wallet').order_by(LedgerEntry.date.desc()).all()

    uploads_folder = f'static/patient_uploads/{patient_id}'
    uploads = []
    if os.path.exists(uploads_folder):
        for filename in os.listdir(uploads_folder):
            if filename.endswith(('.jpg', '.jpeg', '.png', '.pdf')):
                uploads.append({
                    'filename': filename,
                    'description': ''  # Replace with actual description retrieval if available
                })

    broadcasts = BroadcastMessage.query.order_by(BroadcastMessage.created_at.desc()).all()
    messages = FollowUpMessage.query.filter_by(patient_id=patient_id).order_by(FollowUpMessage.timestamp.desc()).all()

    return render_template('patients_dashboard.html', patient=patient, doctors=doctors,
                           appointments=appointments, transactions=transactions,
                           uploads=uploads, broadcasts=broadcasts, messages=messages)


@patient_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        required_fields = ['first_name', 'last_name', 'dob', 'sex', 'email', 'password']
        missing = [f for f in required_fields if not data.get(f)]
        if missing:
            return jsonify({'status': 'fail', 'message': f'Missing: {", ".join(missing)}'}), 400

        if Patient.query.filter_by(email=data.get('email')).first():
            return jsonify({'status': 'fail', 'message': 'Email already exists'}), 409

        patient = Patient(
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            age=data.get('age'),
            dob=data.get('dob'),
            sex=data.get('sex'),
            occupation=data.get('occupation'),
            marital_status=data.get('marital_status'),
            address=data.get('address') or data.get('address_line'),  # Accept either
            city=data.get('city'),
            country=data.get('country', 'Nigeria'),
            tribe=data.get('tribe'),
            race=data.get('race'),
            religion=data.get('religion'),
            phone=data.get('phone', ''),
            email=data.get('email'),
            email_verified=True
        )
        patient.set_password(data.get('password'))

        db.session.add(patient)
        db.session.commit()

        # Log registration to audit log
        print(f"✅ Patient registered: {patient.email}")

        return jsonify({'status': 'success', 'message': 'Patient registered'}), 201

    except Exception as e:
        print("❌ Registration error:", e)
        return jsonify({'status': 'error', 'message': 'Internal server error'}), 500
