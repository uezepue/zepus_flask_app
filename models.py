from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

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
    availability_status = db.Column(db.Boolean, default=False)

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
    session_id = db.Column(db.Integer, db.ForeignKey('consultationsession.id'))
    sender = db.Column(db.String(50))
    message = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

