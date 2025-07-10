from flask import Blueprint, request, jsonify, session
from models import db, Admin, Doctor, Patient

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/api')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Admin login
    admin = Admin.query.filter_by(email=email).first()
    if admin and admin.check_password(password):
        session['admin_id'] = admin.id
        session['admin_name'] = admin.name
        return jsonify({
            'message': 'Admin login successful',
            'role': 'admin',
            'user': {
                'id': admin.id,
                'name': admin.name,
                'email': admin.email
            }
        }), 200

    # Doctor login
    doctor = Doctor.query.filter_by(email=email).first()
    if doctor and doctor.check_password(password):
        if not doctor.is_verified:
            return jsonify({'message': 'Doctor account pending verification'}), 403
        session['doctor_id'] = doctor.id
        return jsonify({
            'message': 'Doctor login successful',
            'role': 'doctor',
            'user': {
                'id': doctor.id,
                'name': doctor.name,
                'email': doctor.email,
                'specialty': doctor.specialty
            }
        }), 200

    # Patient login
    patient = Patient.query.filter_by(email=email).first()
    if patient and patient.check_password(password):
        session['patient_id'] = patient.id
        return jsonify({
            'message': 'Patient login successful',
            'role': 'patient',
            'user': {
                'id': patient.id,
                'first_name': patient.first_name,
                'last_name': patient.last_name,
                'email': patient.email,
                'age': patient.age,
                'sex': patient.sex
            }
        }), 200

    return jsonify({'message': 'Invalid credentials'}), 401


@auth_bp.route('/logout', methods=['POST'])
def logout():
    session_keys = ['admin_id', 'admin_name', 'doctor_id', 'patient_id']
    for key in session_keys:
        session.pop(key, None)
    return jsonify({'message': 'Successfully logged out'}), 200
