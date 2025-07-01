from flask import Blueprint, request, jsonify
from models import db, SystemSetting

settings_bp = Blueprint("settings_bp", __name__, url_prefix="/api/admin/settings")

def get_setting(key, default=""):
    setting = SystemSetting.query.filter_by(key=key).first()
    return setting.value if setting else default

@settings_bp.route("/", methods=["GET"])
def get_settings():
    settings = SystemSetting.query.all()
    return jsonify({s.key: s.value for s in settings})

@settings_bp.route("/update", methods=["POST"])
def update_setting():
    data = request.get_json()
    for key, value in data.items():
        setting = SystemSetting.query.filter_by(key=key).first()
        if setting:
            setting.value = value
        else:
            setting = SystemSetting(key=key, value=value)
            db.session.add(setting)
    db.session.commit()
    return jsonify({"success": True, "message": "Settings updated successfully."})
