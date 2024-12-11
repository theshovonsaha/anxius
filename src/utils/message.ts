import { Message } from '../types';

export const createMessage = (content: string, sender: 'user' | 'ai'): Omit<Message, 'id' | 'timestamp'> => ({
  content,
  sender,
});

export const formatTimestamp = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};