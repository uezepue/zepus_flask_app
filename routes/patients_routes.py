# routes/patients_routes.py

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
    data = request.get_json()
    if Patient.query.filter_by(email=data['email']).first():
        return jsonify({'status': 'fail', 'message': 'Email already exists'})

    patient = Patient(
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        age=data.get('age'),
        dob=data.get('dob'),
        sex=data.get('sex'),
        occupation=data.get('occupation'),
        marital_status=data.get('marital_status'),
        address=data.get('address'),
        city=data.get('city'),
        country=data.get('country'),
        tribe=data.get('tribe'),
        race=data.get('race'),
        religion=data.get('religion'),
        phone=data.get('phone', ''),
        email=data.get('email'),
        email_verified=True
    )
    patient.set_password(data['password'])
    db.session.add(patient)
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Patient registered'})
