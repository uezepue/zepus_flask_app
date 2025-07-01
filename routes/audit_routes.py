from flask import Blueprint, jsonify
from models import db, AuditLog

audit_bp = Blueprint("audit_bp", __name__, url_prefix="/api/admin/audit")

@audit_bp.route("/logs", methods=["GET"])
def get_audit_logs():
    logs = AuditLog.query.order_by(AuditLog.timestamp.desc()).limit(100).all()
    return jsonify({
        "logs": [
            {
                "id": log.id,
                "admin": log.admin,
                "action": log.action,
                "target": log.target,
                "timestamp": log.timestamp,
                "level": log.level
            }
            for log in logs
        ]
    })
