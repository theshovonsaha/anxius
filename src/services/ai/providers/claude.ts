import { AIProviderConfig, AIResponse, AIProvider } from '../../../types/ai';
import { BaseAIProvider } from './base';

export class ClaudeProvider extends BaseAIProvider {
  constructor(provider: AIProvider, config: AIProviderConfig) {
    // Claude's default rate limit
    super(provider, config, 50, 60000);
  }

  async generateResponse(message: string, context: string): Promise<AIResponse> {
    try {
      if (!(await this.checkRateLimit())) {
        return { content: '', error: 'Rate limit exceeded. Please try again later.' };
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          messages: [
            { role: 'system', content: `You are a helpful customer service agent. Use this context to answer questions: ${context}` },
            { role: 'user', content: message }
          ],
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const data = await response.json();
      return { content: data.content[0].text };
    } catch (error) {
      return this.handleError(error);
    }
  }
}