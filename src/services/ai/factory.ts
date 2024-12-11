import { AIProvider, AIProviderConfig } from '../../types/ai';
import { OpenAIProvider } from './providers/openai';
import { ClaudeProvider } from './providers/claude';
import { MistralProvider } from './providers/mistral';
import { GeminiProvider } from './providers/gemini';
import { NvidiaProvider } from './providers/nvidia';
import { BaseAIProvider } from './providers/base';

export class AIProviderFactory {
  static createProvider(provider: AIProvider, config: AIProviderConfig): BaseAIProvider {
    switch (provider) {
      case 'openai':
        return new OpenAIProvider(provider, config);
      case 'claude':
        return new ClaudeProvider(provider, config);
      case 'mistral':
        return new MistralProvider(provider, config);
      case 'gemini':
        return new GeminiProvider(provider, config);
      case 'nvidia':
        return new NvidiaProvider(provider, config);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  static validateApiKey(provider: AIProvider, apiKey: string): boolean {
    try {
      const provider_instance = this.createProvider(provider, { apiKey });
      return provider_instance.validateApiKey(apiKey);
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  }
}