from flask import Blueprint, jsonify
from models import Patient, Doctor, Appointment, Payment
from sqlalchemy.sql import func
from datetime import datetime, timedelta

analytics_bp = Blueprint("analytics_bp", __name__, url_prefix="/api/admin/analytics")

@analytics_bp.route("/summary")
def get_summary():
    total_patients = Patient.query.count()
    total_doctors = Doctor.query.count()
    total_appointments = Appointment.query.count()
    completed_appointments = Appointment.query.filter_by(status="completed").count()

    total_revenue = db.session.query(func.sum(Payment.amount)).scalar() or 0

    return jsonify({
        "total_patients": total_patients,
        "total_doctors": total_doctors,
        "total_appointments": total_appointments,
        "completed_appointments": completed_appointments,
        "total_revenue": total_revenue
    })
