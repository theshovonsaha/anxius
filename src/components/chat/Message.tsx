import React from 'react';
import { Message as MessageType } from '../../types';
import { formatTimestamp } from '../../utils/message';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg relative ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
        }`}
      >
        {message.content}
        <span className="text-xs text-gray-500 absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
};