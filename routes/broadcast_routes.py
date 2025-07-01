from flask import Blueprint, request, jsonify
from models import db, BroadcastMessage
from datetime import datetime

broadcast_bp = Blueprint('broadcast_bp', __name__, url_prefix='/api/admin/broadcast')

@broadcast_bp.route('/send', methods=['POST'])
def send_broadcast():
    data = request.get_json()
    title = data.get('title')
    body = data.get('body')
    group = data.get('target_group')

    if not title or not body or group not in ['patients', 'doctors', 'all']:
        return jsonify({"error": "Invalid input"}), 400

    message = BroadcastMessage(title=title, body=body, target_group=group)
    db.session.add(message)
    db.session.commit()

    return jsonify({"success": True, "message": "Broadcast sent."})

@broadcast_bp.route('/all', methods=['GET'])
def get_broadcasts():
    return jsonify([
        {
            "title": m.title,
            "body": m.body,
            "group": m.target_group,
            "timestamp": m.created_at.strftime("%Y-%m-%d %H:%M")
        }
        for m in BroadcastMessage.query.order_by(BroadcastMessage.created_at.desc()).all()
    ])
