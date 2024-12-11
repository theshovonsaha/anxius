import React from 'react';
import { useChatStore } from '../../store/chatStore';
import { Message } from './Message';
import { useAutoScroll } from '../../hooks/useAutoScroll';

export const MessageList: React.FC = () => {
  const { messages, config } = useChatStore();
  const messagesEndRef = useAutoScroll(messages);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          {config.welcomeMessage}
        </div>
      )}
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};