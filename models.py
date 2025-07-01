from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    age = db.Column(db.Integer)
    dob = db.Column(db.String(20))
    sex = db.Column(db.String(10))
    occupation = db.Column(db.String(100))
    marital_status = db.Column(db.String(50))
    address = db.Column(db.String(200))
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    tribe = db.Column(db.String(50))
    race = db.Column(db.String(50))
    religion = db.Column(db.String(50))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100), unique=True)
    password_hash = db.Column(db.String(128))
    email_verified = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "age": self.age,
            "email": self.email,
            "wallet_balance": 0.00  # Placeholder if no wallet system exists
        }

class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    specialty = db.Column(db.String(100))
    bio = db.Column(db.Text)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100), unique=True)
    password_hash = db.Column(db.String(128))
    consultation_fee = db.Column(db.Float)
    is_verified = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(20), default='pending')

    license_path = db.Column(db.String(200), nullable=True)
    gov_id_path = db.Column(db.String(200), nullable=True)
    specialty_cert_path = db.Column(db.String(200), nullable=True)
    photo_path = db.Column(db.String(200), nullable=True)
    cv_path = db.Column(db.String(200), nullable=True)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "specialty": self.specialty,
            "email": self.email,
            "phone": self.phone,
            "is_verified": self.is_verified,
            "consultation_fee": self.consultation_fee
        }

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password_hash = db.Column(db.String(128))

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

    def to_dict(self):
        return {
            "id": self.id,
            "doctor_id": self.doctor_id,
            "appointment_type": self.appointment_type,
            "consultation_mode": self.consultation_mode,
            "status": self.status,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }

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

class FollowUpMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'))
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    subject = db.Column(db.String(150))
    body = db.Column(db.Text)
    file_path = db.Column(db.String(200), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    read_status = db.Column(db.String(10), default='unread')

class LedgerEntry(db.Model):  # Represents Transactions
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(10), nullable=False)  # 'credit' or 'debit'
    amount = db.Column(db.Float, nullable=False)
    source = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    transaction_id = db.Column(db.String(50), unique=True, nullable=False)
    date = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "amount": self.amount,
            "source": self.source,
            "description": self.description,
            "transaction_id": self.transaction_id,
            "date": self.date.strftime("%Y-%m-%d %H:%M:%S")
        }

class Upload(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    filename = db.Column(db.String(200))
    file_type = db.Column(db.String(50))
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "file_type": self.file_type,
            "uploaded_at": self.uploaded_at.strftime("%Y-%m-%d %H:%M:%S")
        }

class SupportTicket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(150))
    message = db.Column(db.Text)
    user_type = db.Column(db.String(20))  # 'doctor' or 'patient'
    user_id = db.Column(db.Integer)
    status = db.Column(db.String(20), default='open')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AuditLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    admin = db.Column(db.String(100))
    action = db.Column(db.String(150))
    target = db.Column(db.String(100))
    level = db.Column(db.String(20), default='low')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    level = db.Column(db.String(20), default="info")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    read = db.Column(db.Boolean, default=False)

class SystemSetting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.String(500), nullable=False)

class BroadcastMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    body = db.Column(db.Text, nullable=False)
    target_group = db.Column(db.String(20), nullable=False)  # 'doctors', 'patients', or 'all'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "body": self.body,
            "target_group": self.target_group,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
