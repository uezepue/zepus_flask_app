// PatientChatRoom.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function PatientChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionData, setSessionData] = useState({});

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMsg = { sender: 'You', text: trimmed };
    setMessages([...messages, newMsg]);
    setInput('');

    axios.post('/triage', { message: trimmed, session: sessionData })
      .then(res => {
        const reply = { sender: 'Dr Zepus', text: res.data.response };
        setMessages(prev => [...prev, reply]);
        setSessionData(res.data.session);
      })
      .catch(err => {
        setMessages(prev => [...prev, { sender: 'System', text: 'Error contacting server.' }]);
        console.error(err);
      });
  };

  return (
    <div className="chat-room">
      <div className="top-bar">
        <div className="logo">ZEPUS Clinics</div>
        <div className="top-icons">
          <Link to="/dashboard" className="btn-secondary">Back to Dashboard</Link>
        </div>
      </div>

      <main className="chat-widget">
        <h2>Chat with Dr Zepus</h2>
        <div id="chat-box" className="chat-box">
          {messages.map((msg, i) => (
            <div key={i} className={msg.sender === 'You' ? 'user-msg' : 'bot-msg'}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="btn-primary">Send</button>
      </main>
    </div>
  );
}
