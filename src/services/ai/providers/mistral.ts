import { AIProviderConfig, AIResponse, AIProvider } from '../../../types/ai';
import { BaseAIProvider } from './base';

export class MistralProvider extends BaseAIProvider {
  constructor(provider: AIProvider, config: AIProviderConfig) {
    // Mistral's default rate limit
    super(provider, config, 100, 60000);
  }

  async generateResponse(message: string, context: string): Promise<AIResponse> {
    try {
      if (!(await this.checkRateLimit())) {
        return { content: '', error: 'Rate limit exceeded. Please try again later.' };
      }

      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: [
            {
              role: 'system',
              content: context 
                ? `You are a helpful customer service agent. Use this context to answer questions: ${context}`
                : 'You are a helpful customer service agent.'
            },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.statusText}`);
      }

      const data = await response.json();
      return { content: data.choices[0].message.content };
    } catch (error) {
      return this.handleError(error);
    }
  }
}