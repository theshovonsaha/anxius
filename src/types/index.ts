//types/index.ts
export type AIProvider = 'claude' | 'openai' | 'mistral' | 'gemini' | 'nvidia';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// types/index.ts
export interface ChatConfig {
  aiProvider: AIProvider;
  companyName: string;
  welcomeMessage: string;
  knowledgeBase: File | null;
  model: string;
}