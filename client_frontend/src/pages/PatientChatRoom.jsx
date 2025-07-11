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
  const localStream = useRef(null);

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
      // TODO: Implement WebRTC signaling here for remoteVideoRef
    } catch (err) {
      console.error('Media error:', err);
      addMessage('System', '⚠️ Failed to access your camera or microphone.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 card bg-base-100 p-6 shadow-lg">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-xl font-bold text-primary">💬 Live Chat with Doctor</h2>
        <Link to="/patient/dashboard" className="text-sm link link-primary">← Back to Dashboard</Link>
      </div>

      {/* Connection Status */}
      {!connected && <div className="alert alert-info mb-4">🔌 Connecting to server...</div>}
      {connected && inQueue && !doctorReady && (
        <div className="alert alert-warning mb-4">
          🕐 You're in queue {queueLength !== null ? `(${queueLength} ahead)` : ''}. Please wait...
        </div>
      )}
      {doctorReady && (
        <div className="alert alert-success mb-4">
          ✅ A doctor is online. You may begin chatting.
        </div>
      )}

      {/* Chat Section */}
      <div className="h-80 overflow-y-auto border border-gray-300 rounded p-3 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-16">No messages yet. Wait for the doctor to connect.</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block px-3 py-2 rounded-lg text-sm max-w-[75%] break-words ${
              msg.sender === 'You'
                ? 'bg-blue-100 text-blue-900'
                : msg.sender === 'Doctor'
                ? 'bg-green-100 text-green-900'
                : 'bg-gray-300 text-gray-800'
            }`}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex mt-4 gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="input input-bordered w-full"
        />
        <button onClick={sendMessage} className="btn btn-primary">Send</button>
      </div>

      {/* Video Chat Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">🎥 Video & Audio</h3>
        <button
          onClick={startMedia}
          className="btn btn-success mb-4"
        >
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
