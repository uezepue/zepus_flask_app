from flask import Blueprint, jsonify
import psutil
import time
import os
from datetime import timedelta

system_status_bp = Blueprint("system_status_bp", __name__, url_prefix="/api/admin/system")

# Get system uptime based on boot time
def get_uptime():
    uptime_seconds = time.time() - psutil.boot_time()
    return str(timedelta(seconds=int(uptime_seconds)))

@system_status_bp.route("/status", methods=["GET"])
def get_system_status():
    try:
        cpu_usage = psutil.cpu_percent(interval=0.5)
        memory_usage = psutil.virtual_memory().percent
        uptime = get_uptime()

        return jsonify({
            "cpu": cpu_usage,
            "memory": memory_usage,
            "uptime": uptime
        })
    except Exception as e:
        return jsonify({"error": "Failed to fetch system metrics", "details": str(e)}), 500
