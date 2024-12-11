import { useEffect, useRef } from 'react';
import { Message } from '../types';

export const useAutoScroll = (messages: Message[]) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    scrollToBottom();
    // Add a small delay to ensure content is rendered
    const timeoutId = setTimeout(scrollToBottom, 100);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  return messagesEndRef;
};