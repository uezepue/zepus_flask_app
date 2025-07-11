import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io();

export default function DoctorChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [currentPatient, setCurrentPatient] = useState(null);
  const chatEndRef = useRef(null);

  const doctor = JSON.parse(localStorage.getItem('user'));
  const doctorId = doctor?.id || 1;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    socket.emit('doctor_join', { doctor_id: doctorId });

    socket.on('chat_message', (data) => {
      setMessages(prev => [...prev, { sender: 'Patient', text: data.message }]);
    });

    socket.on('next_patient', (data) => {
      if (data.patient_id) {
        setCurrentPatient(data.patient_id);
        setMessages(prev => [...prev, { sender: 'System', text: `👤 Patient ${data.patient_id} is now connected.` }]);
      } else if (data.msg) {
        setMessages(prev => [...prev, { sender: 'System', text: data.msg }]);
      }
    });

    return () => {
      socket.off('chat_message');
      socket.off('next_patient');
    };
  }, [doctorId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || !currentPatient) return;

    setInput('');
    setError(null);
    setMessages(prev => [...prev, { sender: 'Dr. You', text: trimmed }]);

    try {
      socket.emit('doctor_message', {
        patient_id: currentPatient,
        message: trimmed,
      });
    } catch (err) {
      console.error(err);
      setError('❌ Message not delivered');
      setMessages(prev => [...prev, { sender: 'System', text: '❌ Message not delivered' }]);
    }
  };

  const getNextPatient = () => {
    socket.emit('next_patient', { doctor_id: doctorId });
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 card bg-base-100 p-6 shadow-lg">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-xl font-bold text-primary">🩺 ZEPUS Clinics – Doctor Chatroom</h2>
        <Link to="/doctor/dashboard" className="text-sm link link-primary">← Back to Dashboard</Link>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={getNextPatient}
          className="btn btn-success"
        >
          📣 See Next Patient
        </button>
        <span className="text-sm text-gray-600 font-medium">
          {currentPatient ? `Chatting with Patient ${currentPatient}` : 'No patient in session'}
        </span>
      </div>

      <div className="h-96 overflow-y-auto border rounded bg-gray-50 p-3" id="chat-box">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-20">No messages yet. Request the next patient to start chatting.</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 flex ${msg.sender === 'Dr. You' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-3 py-2 rounded-lg max-w-[80%] break-words text-sm ${
              msg.sender === 'Dr. You'
                ? 'bg-blue-100 text-blue-900'
                : msg.sender === 'Patient'
                ? 'bg-green-100 text-green-900'
                : 'bg-gray-300 text-gray-700'
            }`}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {error && <p className="text-error text-sm mt-2">{error}</p>}

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

      <div className="mt-6 text-sm text-gray-500 border-t pt-4">
        📞 Audio/Video Call features coming soon.
      </div>
    </div>
  );
}
