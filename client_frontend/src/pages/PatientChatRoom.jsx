import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

const socket = io();

export default function PatientChatRoom({ patientId }) {
  const [connected, setConnected] = useState(false);
  const [inQueue, setInQueue] = useState(false);
  const [doctorReady, setDoctorReady] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [queueLength, setQueueLength] = useState(null);

  const chatEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStream = useRef(null); // Store stream to stop it on unmount

  useEffect(() => {
    socket.emit('patient_join', { patient_id: patientId });

    socket.on('joined', (data) => {
      setInQueue(true);
      addMessage('System', data.msg);
    });

    socket.on('called', (data) => {
      setDoctorReady(true);
      addMessage('System', data.msg || '✅ A doctor is now ready to see you.');
    });

    socket.on('queue_update', (data) => {
      setQueueLength(data.queue_length);
    });

    socket.on('chat_message', (data) => {
      addMessage('Doctor', data.message);
    });

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => {
      setConnected(false);
      setInQueue(false);
      setDoctorReady(false);
    });

    return () => {
      socket.disconnect();
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [patientId]);

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, text }]);
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput('');
    addMessage('You', trimmed);
    socket.emit('patient_message', { patient_id: patientId, message: trimmed });
  };

  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Placeholder: remote video setup logic (WebRTC signaling not included)
    } catch (err) {
      console.error('Media error:', err);
      addMessage('System', '⚠️ Failed to access your camera or microphone.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-700">💬 Live Chat with Doctor</h2>
        <Link to="/dashboard/patient" className="text-sm text-blue-600 hover:underline">← Back to Dashboard</Link>
      </div>

      {!connected && <p className="text-gray-500">Connecting...</p>}
      {connected && inQueue && !doctorReady && (
        <p className="text-yellow-600 mb-2">🕐 Please wait... You are in queue {queueLength !== null && `(${queueLength} waiting)`}</p>
      )}
      {doctorReady && (
        <p className="text-green-700 mb-2">✅ A doctor is online. You can start chatting.</p>
      )}

      <div className="h-80 overflow-y-auto border p-4 mb-4 rounded bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block px-3 py-2 rounded-lg ${msg.sender === 'You' ? 'bg-blue-100 text-blue-900' : msg.sender === 'Doctor' ? 'bg-green-100 text-green-900' : 'bg-gray-300 text-gray-800'}`}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="flex-grow p-2 border border-gray-300 rounded"
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Send
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">🎥 Video & Audio</h3>
        <button onClick={startMedia} className="bg-green-600 text-white px-4 py-1 rounded mb-2">
          Start Camera
        </button>
        <div className="grid grid-cols-2 gap-4">
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-48 bg-black rounded" />
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-48 bg-black rounded" />
        </div>
      </div>
    </div>
  );
}
