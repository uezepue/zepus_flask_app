from flask import Blueprint, send_from_directory, request, jsonify, session, redirect, url_for
from models import Doctor, Patient, Admin, Appointment, AuditLog, db

admin_bp = Blueprint('admin_bp', __name__, url_prefix='/api/admin')

# =============================
# Admin Info (React portal)
# =============================
@admin_bp.route('/info', methods=['GET'])
def get_admin_info():
    admin_id = session.get('admin_id')
    if not admin_id:
        return jsonify({'error': 'Not logged in'}), 401

    admin = Admin.query.get(admin_id)
    if not admin:
        return jsonify({'error': 'Admin not found'}), 404

    return jsonify({
        "id": admin.id,
        "name": admin.name,
        "email": admin.email,
        "clearance_level": getattr(admin, 'clearance_level', 'low'),
        "assigned_department": getattr(admin, 'assigned_department', 'Doctors')
    })

# =============================
# Admin Dashboard Stats
# =============================
@admin_bp.route('/stats', methods=['GET'])
def get_admin_stats():
    total_patients = Patient.query.count()
    total_doctors = Doctor.query.count()
    ongoing_consults = Appointment.query.filter_by(status="ongoing").count()
    return jsonify({
        "patients": total_patients,
        "doctors": total_doctors,
        "consultations": ongoing_consults
    })

# =============================
# New: Get all unverified doctors (for React)
# =============================
@admin_bp.route('/unverified-doctors', methods=['GET'])
def get_unverified_doctors():
    unverified_doctors = Doctor.query.filter_by(is_verified=False).all()
    return jsonify([{
        "id": doc.id,
        "name": doc.name,
        "specialty": doc.specialty,
        "email": doc.email,
        "phone": doc.phone,
        "license_path": doc.license_path,
        "gov_id_path": doc.gov_id_path,
        "specialty_cert_path": doc.specialty_cert_path,
        "photo_path": doc.photo_path,
        "cv_path": doc.cv_path,
    } for doc in unverified_doctors])

# =============================
# Approve Doctor
# =============================
@admin_bp.route('/approve-doctor/<int:doctor_id>', methods=['POST'])
def approve_doctor(doctor_id):
    doctor = Doctor.query.get_or_404(doctor_id)
    doctor.is_verified = True
    db.session.commit()

    admin_name = session.get('admin_name', 'Unknown')
    log = AuditLog(admin=admin_name, action="Approved doctor", target=f"Doctor #{doctor_id}", level="medium")
    db.session.add(log)
    db.session.commit()

    return jsonify({'status': 'approved', 'doctor_id': doctor_id})

# =============================
# Reject Doctor
# =============================
@admin_bp.route('/reject-doctor/<int:doctor_id>', methods=['POST'])
def reject_doctor(doctor_id):
    doctor = Doctor.query.get_or_404(doctor_id)
    db.session.delete(doctor)
    db.session.commit()

    admin_name = session.get('admin_name', 'Unknown')
    log = AuditLog(admin=admin_name, action="Rejected doctor", target=f"Doctor #{doctor_id}", level="high")
    db.session.add(log)
    db.session.commit()

    return jsonify({'status': 'rejected', 'doctor_id': doctor_id})

# =============================
# Serve Doctor Uploads
# =============================
@admin_bp.route('/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory('static/doctor_verification_uploads', filename)

# =============================
# Audit Logs View (Still for HTML if needed)
# =============================
@admin_bp.route('/audit-logs')
def view_audit_logs():
    level = request.args.get('level')
    admin = request.args.get('admin')

    query = AuditLog.query
    if level:
        query = query.filter_by(level=level)
    if admin:
        query = query.filter_by(admin=admin)

    logs = query.order_by(AuditLog.timestamp.desc()).limit(100).all()
    return jsonify([{
        "id": log.id,
        "admin": log.admin,
        "action": log.action,
        "target": log.target,
        "level": log.level,
        "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S")
    } for log in logs])
