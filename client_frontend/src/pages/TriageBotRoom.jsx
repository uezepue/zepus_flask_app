import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function TriageBotRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionData, setSessionData] = useState({});
  const chatEndRef = useRef(null);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMsg = { sender: 'You', text: trimmed };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    axios.post('/triage', { message: trimmed, session: sessionData })
      .then(res => {
        const reply = { sender: 'Dr Zepus', text: res.data.response };
        setMessages(prev => [...prev, reply]);
        setSessionData(res.data.session);
      })
      .catch(err => {
        console.error(err);
        setMessages(prev => [...prev, { sender: 'System', text: '⚠️ Error contacting server.' }]);
      });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-xl font-bold text-blue-700">🤖 Chat with Dr Zepus (AI)</h2>
        <Link to="/dashboard/patient" className="text-sm text-blue-600 hover:underline">← Back to Dashboard</Link>
      </div>

      <div className="h-80 overflow-y-auto border p-4 mb-4 rounded bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block px-3 py-2 rounded-lg ${msg.sender === 'You' ? 'bg-blue-100 text-blue-900' : msg.sender === 'Dr Zepus' ? 'bg-green-100 text-green-900' : 'bg-gray-300 text-gray-800'}`}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-grow p-2 border border-gray-300 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
