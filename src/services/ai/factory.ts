import { AIProvider, AIProviderConfig } from '../../types/ai';
import { OpenAIProvider } from './providers/openai';
import { ClaudeProvider } from './providers/claude';

export class AIProviderFactory {
  static createProvider(provider: AIProvider, config: AIProviderConfig) {
    switch (provider) {
      case 'openai':
        return new OpenAIProvider(config);
      case 'claude':
        return new ClaudeProvider(config);
      // Add other providers as needed
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }
}