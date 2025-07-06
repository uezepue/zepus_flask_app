from flask import session, request
from flask_socketio import emit, join_room, leave_room
from models import db, Appointment
from datetime import datetime

# WebSocket Chat Management for Live Patient-Doctor Consultation

connected_doctors = {}
connected_patients = {}
chat_queue = []  # FIFO queue for patients

# ============== Patient Events ==============
def handle_patient_connect(socketio):
    @socketio.on('patient_join')
    def patient_join(data):
        patient_id = data.get('patient_id')
        room = f"patient_{patient_id}"
        join_room(room)
        connected_patients[patient_id] = room
        chat_queue.append(patient_id)
        emit('joined', {'msg': 'You joined the queue.'}, room=room)
        emit('queue_update', {'queue_length': len(chat_queue)}, broadcast=True)

    @socketio.on('patient_message')
    def patient_message(data):
        doctor_id = data.get('doctor_id')
        patient_id = data.get('patient_id')
        msg = data.get('message')
        room = f"doctor_{doctor_id}"
        emit('chat_message', {
            'from': 'patient',
            'message': msg,
            'patient_id': patient_id
        }, room=room)

    @socketio.on('patient_audio_offer')
    def patient_audio_offer(data):
        doctor_id = data.get('doctor_id')
        emit('audio_offer', data, room=f"doctor_{doctor_id}")

    @socketio.on('patient_video_offer')
    def patient_video_offer(data):
        doctor_id = data.get('doctor_id')
        emit('video_offer', data, room=f"doctor_{doctor_id}")

# ============== Doctor Events ==============
def handle_doctor_connect(socketio):
    @socketio.on('doctor_join')
    def doctor_join(data):
        doctor_id = data.get('doctor_id')
        room = f"doctor_{doctor_id}"
        join_room(room)
        connected_doctors[doctor_id] = room
        emit('joined', {'msg': 'Doctor online.'}, room=room)

    @socketio.on('doctor_message')
    def doctor_message(data):
        patient_id = data.get('patient_id')
        msg = data.get('message')
        room = connected_patients.get(patient_id)
        if room:
            emit('chat_message', {'from': 'doctor', 'message': msg}, room=room)

    @socketio.on('next_patient')
    def next_patient(data):
        doctor_id = data.get('doctor_id')
        if chat_queue:
            next_id = chat_queue.pop(0)
            emit('next_patient', {'patient_id': next_id}, room=f"doctor_{doctor_id}")
            emit('called', {'msg': 'Doctor is ready to chat.'}, room=f"patient_{next_id}")
            emit('queue_update', {'queue_length': len(chat_queue)}, broadcast=True)
        else:
            emit('next_patient', {'msg': 'No patients in queue.'}, room=f"doctor_{doctor_id}")

    @socketio.on('doctor_audio_answer')
    def doctor_audio_answer(data):
        patient_id = data.get('patient_id')
        emit('audio_answer', data, room=f"patient_{patient_id}")

    @socketio.on('doctor_video_answer')
    def doctor_video_answer(data):
        patient_id = data.get('patient_id')
        emit('video_answer', data, room=f"patient_{patient_id}")

# ============== Handle Disconnects ==============
def handle_disconnects(socketio):
    @socketio.on('disconnect')
    def disconnect():
        sid = request.sid
        # Remove from patient list
        for pid, room in list(connected_patients.items()):
            if room == sid:
                leave_room(room)
                connected_patients.pop(pid, None)
                if pid in chat_queue:
                    chat_queue.remove(pid)
                break
        # Remove from doctor list
        for did, room in list(connected_doctors.items()):
            if room == sid:
                leave_room(room)
                connected_doctors.pop(did, None)
                break
        emit('queue_update', {'queue_length': len(chat_queue)}, broadcast=True)

# ============== Register All Socket.IO Events ==============
def register_socketio_events(socketio):
    handle_patient_connect(socketio)
    handle_doctor_connect(socketio)
    handle_disconnects(socketio)
