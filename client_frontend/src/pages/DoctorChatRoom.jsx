// DoctorChatRoom.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function DoctorChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    const trimmed = input?.trim();
    if (!trimmed) return;

    setInput('');
    setMessages(prev => [...prev, { sender: 'You', text: trimmed }]);

    try {
      const res = await axios.post('/api/doctor/chat', { message: trimmed });
      const replyText = res?.data?.reply ? res.data.reply : 'No response from server.';
      setMessages(prev => [...prev, { sender: 'Patient', text: replyText }]);
    } catch (err) {
      console.error(err);
      setError('Failed to send message. Please try again.');
      setMessages(prev => [...prev, { sender: 'System', text: '❌ Message not delivered' }]);
    }
  };

  return (
    <div className="chat-room">
      <div className="top-bar">
        <div>ZEPUS Clinics – Doctor Chatroom</div>
        <div>
          <Link to="/doctor/dashboard" className="btn-secondary">Back to Dashboard</Link>
        </div>
      </div>

      <main className="chat-widget">
        <h2>Chat with Patients</h2>
        <div id="chat-box" className="chat-box">
          {messages.map((msg, i) => (
            <div key={i} className={msg.sender === 'You' ? 'user-msg' : 'bot-msg'}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          value={input || ''}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="btn-primary">Send</button>
      </main>
    </div>
  );
}
