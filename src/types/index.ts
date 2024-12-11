export type AIProvider = 'claude' | 'openai' | 'mistral' | 'gemini' | 'nvidia';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatConfig {
  aiProvider: AIProvider;
  companyName: string;
  welcomeMessage: string;
  knowledgeBase: File | null;
}