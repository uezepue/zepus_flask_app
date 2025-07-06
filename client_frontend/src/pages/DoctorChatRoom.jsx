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

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    socket.emit('doctor_join', { doctor_id: 1 }); // replace with real doctor ID from session

    socket.on('chat_message', (data) => {
      setMessages(prev => [...prev, { sender: 'Patient', text: data.message }]);
    });

    socket.on('next_patient', (data) => {
      if (data.patient_id) {
        setCurrentPatient(data.patient_id);
        setMessages(prev => [...prev, { sender: 'System', text: `Patient ${data.patient_id} is now connected.` }]);
      } else if (data.msg) {
        setMessages(prev => [...prev, { sender: 'System', text: data.msg }]);
      }
    });

    return () => {
      socket.off('chat_message');
      socket.off('next_patient');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || !currentPatient) return;

    setInput('');
    setMessages(prev => [...prev, { sender: 'Dr. You', text: trimmed }]);

    try {
      socket.emit('doctor_message', {
        patient_id: currentPatient,
        message: trimmed
      });
    } catch (err) {
      console.error(err);
      setError('❌ Message not delivered');
      setMessages(prev => [...prev, { sender: 'System', text: '❌ Message not delivered' }]);
    }
  };

  const getNextPatient = () => {
    socket.emit('next_patient', { doctor_id: 1 }); // replace with real doctor ID from session
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded shadow-lg">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-xl font-bold text-blue-700">🩺 ZEPUS Clinics – Doctor Chatroom</h2>
        <Link to="/doctor/dashboard" className="text-sm text-blue-600 hover:underline">← Back to Dashboard</Link>
      </div>

      <div className="flex justify-between mb-4">
        <button onClick={getNextPatient} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          📣 See Next Patient
        </button>
        <span className="text-gray-700">{currentPatient ? `Chatting with Patient ${currentPatient}` : 'No patient in session'}</span>
      </div>

      <div className="h-96 overflow-y-auto border p-4 rounded bg-gray-50" id="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.sender === 'Dr. You' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${msg.sender === 'Dr. You' ? 'bg-blue-100 text-blue-900' : msg.sender === 'Patient' ? 'bg-green-100 text-green-900' : 'bg-gray-300 text-gray-800'}`}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <div className="flex mt-4 gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-grow p-2 border border-gray-300 rounded-md"
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Send</button>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        📞 Upcoming Features: Audio & Video Call buttons
        {/* Future buttons for audio/video */}
      </div>
    </div>
  );
}
