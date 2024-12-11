import { create } from 'zustand';
import { AIProvider, Message, ChatConfig } from '../types';

interface ChatState {
  messages: Message[];
  config: ChatConfig;
  isOpen: boolean;
  setConfig: (config: Partial<ChatConfig>) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  toggleChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  config: {
    aiProvider: 'openai',
    companyName: '',
    welcomeMessage: 'Hello! How can I assist you today?',
    knowledgeBase: null,
    model: ''
  },
  isOpen: false,
  setConfig: (newConfig) =>
    set((state) => ({ config: { ...state.config, ...newConfig } })),
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ],
    })),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
}));