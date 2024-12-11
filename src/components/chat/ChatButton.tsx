import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';

export const ChatButton: React.FC = () => {
  const { toggleChat, isOpen } = useChatStore();

  return (
    <button
      onClick={toggleChat}
      className={`fixed bottom-4 right-4 p-4 rounded-full shadow-lg transition-colors ${
        isOpen ? 'bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </button>
  );
};