import React from 'react';
import { useChatStore } from '../store/chatStore';

export const MessageList: React.FC = () => {
  const { messages } = useChatStore();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] p-3 rounded-lg ${
              message.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};