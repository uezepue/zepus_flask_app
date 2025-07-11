import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function TriageBotRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionData, setSessionData] = useState({});
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { sender: 'You', text: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/triage', {
        message: trimmed,
        session: sessionData,
      });

      const replyText = res?.data?.response || '⚠️ No reply from Dr Zepus.';
      const updatedSession = res?.data?.session || {};

      setMessages(prev => [...prev, { sender: 'Dr Zepus', text: replyText }]);
      setSessionData(updatedSession);
    } catch (err) {
      console.error('❌ Error contacting /triage:', err);
      setMessages(prev => [...prev, { sender: 'System', text: '⚠️ Error contacting server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 card bg-base-100 p-6 shadow-lg">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-xl font-bold text-primary">🤖 Chat with Dr Zepus (AI)</h2>
        <Link to="/patient/dashboard" className="text-sm link link-primary">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Chat Box */}
      <div className="h-96 overflow-y-auto border rounded bg-gray-50 p-4 mb-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-10">Start chatting with Dr Zepus...</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block px-4 py-2 rounded-lg max-w-[75%] text-sm break-words ${
              msg.sender === 'You'
                ? 'bg-blue-100 text-blue-900'
                : msg.sender === 'Dr Zepus'
                ? 'bg-green-100 text-green-900'
                : 'bg-gray-300 text-gray-800'
            }`}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left text-sm text-gray-500 italic">Dr Zepus is typing...</div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="input input-bordered w-full"
        />
        <button
          onClick={sendMessage}
          className={`btn ${loading ? 'btn-disabled' : 'btn-primary'}`}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
