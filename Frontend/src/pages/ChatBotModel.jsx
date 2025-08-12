import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa'; // Added FaRobot and FaPaperPlane
import axios from 'axios';
import './ChatbotModal.css'; // Ensure the CSS file name is consistent

const ChatbotModal = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to state
    const userMessage = { from: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput(''); // Clear input immediately

    try {
      // Assuming your backend API for chatbot is at /api/chatbot
      const res = await axios.post('http://localhost:5000/api/chatbot', { message: userMessage.text });
      setMessages(prev => [...prev, { from: 'bot', text: res.data.answer }]);
    } catch (err) {
      console.error("Chatbot API error:", err); // Log error for debugging
      setMessages(prev => [...prev, { from: 'bot', text: "Sorry, I couldn't get an answer right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-modal-overlay" onClick={onClose}>
      <div className="chatbot-modal" onClick={e => e.stopPropagation()}>
        <header className="chatbot-header">
          <FaRobot className="chatbot-header-icon" />
          <span>AI Assistant</span>
          <button className="chatbot-close-btn" onClick={onClose}><FaTimes /></button>
        </header>
        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-msg ${msg.from}`}>
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="chatbot-msg bot">Thinking...</div>
          )}
          <div ref={messagesEndRef} /> {/* Reference for auto-scrolling */}
        </div>
        <div className="chatbot-input-row">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;