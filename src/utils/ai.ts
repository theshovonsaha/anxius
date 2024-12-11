import { AIProvider } from '../types';

export const AI_PROVIDERS: AIProvider[] = ['claude', 'openai', 'mistral', 'gemini', 'nvidia'];

export const formatProviderName = (provider: AIProvider): string => {
  return provider.charAt(0).toUpperCase() + provider.slice(1);
};

export const validateProvider = (provider: string): provider is AIProvider => {
  return AI_PROVIDERS.includes(provider as AIProvider);
};