import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

export const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, isLoading } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    await sendMessage(message.trim());
    setMessage(''); // Clear input after sending
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};