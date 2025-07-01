from flask import Blueprint, jsonify, request, session
from models import db, SupportTicket, AuditLog
from datetime import datetime

support_bp = Blueprint("support_bp", __name__, url_prefix="/api/admin/support")

@support_bp.route("/tickets", methods=["GET"])
def get_tickets():
    tickets = SupportTicket.query.order_by(SupportTicket.created_at.desc()).all()
    return jsonify({
        "tickets": [
            {
                "id": t.id,
                "subject": t.subject,
                "message": t.message,
                "userType": t.user_type,
                "userId": t.user_id,
                "status": t.status,
                "timestamp": t.created_at
            }
            for t in tickets
        ]
    })


@support_bp.route("/ticket/<int:ticket_id>/status", methods=["POST"])
def update_ticket_status(ticket_id):
    new_status = request.json.get("status")
    ticket = SupportTicket.query.get(ticket_id)
    if not ticket:
        return jsonify({"success": False, "message": "Ticket not found"}), 404

    ticket.status = new_status
    db.session.commit()

    admin_name = session.get('admin_name', 'Unknown')
    log = AuditLog(
        admin=admin_name,
        action=f"Marked support ticket as {new_status}",
        target=f"Ticket #{ticket.id}",
        level="medium"
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({"success": True, "ticket": {
        "id": ticket.id,
        "subject": ticket.subject,
        "message": ticket.message,
        "userType": ticket.user_type,
        "userId": ticket.user_id,
        "status": ticket.status,
        "timestamp": ticket.created_at
    }})
