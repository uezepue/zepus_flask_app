from flask import Flask, request, jsonify, render_template, session, redirect, url_for, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///zepus.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.getenv('SECRET_KEY', 'zepus_secret_key')

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

os.makedirs('generated_documents', exist_ok=True)

# ====================================================
# DATABASE MODELS
# ====================================================

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    age = db.Column(db.Integer)
    sex = db.Column(db.String(10))
    occupation = db.Column(db.String(100))
    address = db.Column(db.String(200))
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100), unique=True)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    specialty = db.Column(db.String(100))
    bio = db.Column(db.Text)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100), unique=True)
    password_hash = db.Column(db.String(128))
    consultation_fee = db.Column(db.Float)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'))
    appointment_type = db.Column(db.String(50))
    consultation_mode = db.Column(db.String(50))
    status = db.Column(db.String(50), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointment.id'))
    amount = db.Column(db.Float)
    payment_method = db.Column(db.String(50))
    payment_reference = db.Column(db.String(100))
    status = db.Column(db.String(20), default="pending")
    paid_at = db.Column(db.DateTime, default=datetime.utcnow)


class ConsultationSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'))
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointment.id'))
    session_start = db.Column(db.DateTime, default=datetime.utcnow)
    session_end = db.Column(db.DateTime)
    session_summary = db.Column(db.Text)
    status = db.Column(db.String(50), default="ongoing")

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('consultation_session.id'))
    sender = db.Column(db.String(50))
    message = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# ====================================================
# ROUTES: AUTH + DASHBOARDS
# ====================================================

@app.context_processor
def inject_now():
    return {'now': datetime.now()}

@app.route('/')
def homepage():
    return render_template('login.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        doctor = Doctor.query.filter_by(email=email).first()
        patient = Patient.query.filter_by(email=email).first()

        if doctor and doctor.check_password(password):
            session['user_type'] = 'doctor'
            session['doctor_id'] = doctor.id
            return redirect(url_for('doctor_dashboard'))

        if patient and patient.check_password(password):
            session['user_type'] = 'patient'
            session['patient_id'] = patient.id
            return redirect(url_for('patient_dashboard'))
        return "Invalid credentials!"

    return render_template('login.html')

@app.route('/patient-dashboard')
def patient_dashboard():
    patient_id = session.get('patient_id')
    patient = Patient.query.get(patient_id)
    doctors = Doctor.query.all()
    appointments = Appointment.query.filter_by(patient_id=patient_id).all()
    return render_template('patient_dashboard.html', doctors=doctors, appointments=appointments)

@app.route('/doctor-dashboard')
def doctor_dashboard():
    doctor_id = session.get('doctor_id')
    doctor = Doctor.query.get(doctor_id)
    appointments = Appointment.query.filter_by(doctor_id=doctor_id).all()
    return render_template('doctor_dashboard.html', appointments=appointments)

# ====================================================
# TRIAGE CHAT ROUTE
# ====================================================
@app.route('/triage-chat')
def triage_chat():
    return render_template('triage_chat.html')

# ====================================================
# PATIENT / DOCTOR REGISTRATION API
# ====================================================

@app.route('/patient-register', methods=['POST'])
def patient_register():
    data = request.get_json()
    if Patient.query.filter_by(email=data['email']).first():
        return jsonify({'status': 'fail', 'message': 'Email already exists'})
    patient = Patient(**{k: data[k] for k in ['name', 'age', 'sex', 'occupation', 'address', 'city', 'country', 'phone', 'email']})
    patient.set_password(data['password'])
    db.session.add(patient)
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Patient registered'})

@app.route('/doctor-register', methods=['POST'])
def doctor_register():
    data = request.get_json()
    if Doctor.query.filter_by(email=data['email']).first():
        return jsonify({'status': 'fail', 'message': 'Email already exists'})
    doctor = Doctor(**{k: data[k] for k in ['name', 'specialty', 'bio', 'phone', 'email', 'consultation_fee']})
    doctor.set_password(data['password'])
    db.session.add(doctor)
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Doctor registered'})

# ====================================================
# APPOINTMENT, PAYMENT & CONSULTATION
# ====================================================

@app.route('/book-appointment', methods=['POST'])
def book_appointment():
    data = request.get_json()
    appointment = Appointment(**data)
    db.session.add(appointment)
    db.session.commit()
    return jsonify({'status': 'success', 'appointment_id': appointment.id})

@app.route('/make-payment', methods=['POST'])
def make_payment():
    data = request.get_json()
    appointment = Appointment.query.get(data['appointment_id'])
    doctor = Doctor.query.get(appointment.doctor_id)
    payment = Payment(appointment_id=appointment.id, amount=doctor.consultation_fee, status='paid', payment_method=data['payment_method'], payment_reference="ZEPUS-PAY-123456")
    db.session.add(payment)
    appointment.status = 'paid'
    db.session.commit()
    return jsonify({'status': 'success', 'amount': doctor.consultation_fee})

@app.route('/start-consultation', methods=['POST'])
def start_consultation():
    data = request.get_json()
    appointment = Appointment.query.get(data['appointment_id'])
    if appointment.status != 'paid':
        return jsonify({'status': 'fail', 'message': 'Payment required'})
    session_obj = ConsultationSession(patient_id=appointment.patient_id, doctor_id=appointment.doctor_id, appointment_id=appointment.id)
    db.session.add(session_obj)
    db.session.commit()
    return jsonify({'status': 'success', 'session_id': session_obj.id})

# ====================================================
# AI TRIAGE LOGIC WITH FULL AUTOPILOT FLOW
# ====================================================
LLM_URL = os.getenv("LLM_URL", "http://localhost:11434")
HEADERS = {"Content-Type": "application/json", "Accept": "application/json"}
TRIAGE_PROMPT = """
You are Dr. Zepus AI, a highly empathetic digital medical assistant. As soon as the patient connects, you should greet them politely, introduce yourself once, and immediately request their name. Then collect their age, gender, and occupation. Afterward, proceed step-by-step with triage using very simple language. Avoid medical jargons. Do not give diagnosis directly. Avoid repeating introductions. Ask one question at a time. Always wait for the patient's reply before proceeding. Avoid open-ended questions when you can give options or yes/no alternatives. Keep it conversational, empathetic and patient-centered.
"""

@app.route('/triage', methods=['POST'])
def triage():
    data = request.get_json()
    session_data = data.get("session", {})
    message = data.get("message", "").strip()

    if not session_data.get("initialized"):
        session_data.update({
            "step": "processing",
            "conversation": [{"role": "system", "content": TRIAGE_PROMPT}],
            "initialized": True
        })
        response = "Hello! I am Dr. Zepus AI. May I know your name, please?"
    else:
        session_data["conversation"].append({"role": "user", "content": message})
        try:
            response_llm = requests.post(
                f"{LLM_URL}/api/chat",
                headers=HEADERS,
                json={"model": "meditron:7b", "messages": session_data["conversation"], "stream": False},
                timeout=60
            )
            result = response_llm.json()
            reply = result.get("message", {}).get("content", "No response received.")
            session_data["conversation"].append({"role": "assistant", "content": reply})
            response = reply
        except Exception as e:
            response = f"LLM unavailable: {str(e)}"
    return jsonify({"response": response, "session": session_data})

# ====================================================
# START THE SERVER
# ====================================================
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5055)
