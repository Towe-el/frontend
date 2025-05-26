import { useState } from 'react';

const DialogueModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages([...messages, { sender: 'user', text: userMessage }]);
    setInput('');

    // Simulated AI response (replace with real API call)
    const response = await new Promise((resolve) =>
      setTimeout(() => resolve({ text: `You said: "${userMessage}" — I'm listening.` }), 500)
    );

    setMessages(prev => [...prev, { sender: 'ai', text: response.text }]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-lg flex flex-col">
        <button className="self-end text-gray-500 hover:text-black mb-2" onClick={onClose}>×</button>
        <h2 className="text-lg font-semibold mb-4">Talk to AI</h2>
        <div className="flex-1 overflow-y-auto max-h-[300px] mb-4 border p-2 rounded">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 text-sm ${
                msg.sender === 'user' ? 'text-right text-blue-600' : 'text-left text-gray-700'
              }`}
            >
              <span>{msg.text}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-grow border rounded px-3 py-2 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogueModal;