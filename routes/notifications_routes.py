from flask import Blueprint, request, jsonify
from models import db, Notification

notifications_bp = Blueprint("notifications_bp", __name__, url_prefix="/api/admin/notifications")

@notifications_bp.route("/", methods=["GET"])
def list_notifications():
    notifications = Notification.query.order_by(Notification.created_at.desc()).all()
    return jsonify([{
        "id": n.id,
        "title": n.title,
        "message": n.message,
        "level": n.level,
        "created_at": n.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        "read": n.read
    } for n in notifications])

@notifications_bp.route("/create", methods=["POST"])
def create_notification():
    data = request.get_json()
    new_notification = Notification(
        title=data["title"],
        message=data["message"],
        level=data.get("level", "info")
    )
    db.session.add(new_notification)
    db.session.commit()
    return jsonify({"success": True, "message": "Notification created."})

@notifications_bp.route("/mark-read/<int:id>", methods=["POST"])
def mark_read(id):
    notif = Notification.query.get_or_404(id)
    notif.read = True
    db.session.commit()
    return jsonify({"success": True, "message": "Marked as read."})
