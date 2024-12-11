import { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { createMessage } from '../utils/message';

export const useMessageInput = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addMessage } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    addMessage(createMessage(message.trim(), 'user'));

    // Simulate AI response - in production, this would call your AI service
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addMessage(
        createMessage(
          "I'm here to help! However, this is just a demo response. In production, this would be handled by the selected AI provider.",
          'ai'
        )
      );
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  return { message, setMessage, handleSubmit, isLoading };
};