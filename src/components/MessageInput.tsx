import React from 'react';
import { Send } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export const MessageInput: React.FC = () => {
  const [message, setMessage] = React.useState('');
  const { addMessage } = useChatStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addMessage({ content: message, sender: 'user' });
    // Simulate AI response - in production, this would call your AI service
    setTimeout(() => {
      addMessage({
        content: "I'm here to help! However, this is just a demo response. In production, this would be handled by the selected AI provider.",
        sender: 'ai',
      });
    }, 1000);

    setMessage('');
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
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};