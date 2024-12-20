import { AIProviderConfig, AIResponse, AIProvider } from '../../../types/ai';
import { BaseAIProvider } from './base';

export class OpenAIProvider extends BaseAIProvider {
  private organizationId?: string;

  constructor(provider: AIProvider, config: AIProviderConfig) {
    // OpenAI has a default rate limit of 60 requests per minute
    super(provider, config, 60, 60000);
    this.organizationId = config.organizationId;
  }

  async generateResponse(message: string, context: string): Promise<AIResponse> {
    try {
      // Check rate limit before making request
      if (!(await this.checkRateLimit())) {
        return { content: '', error: 'Rate limit exceeded. Please try again later.' };
      }

      // Validate API key format (sk-****)
      if (!this.apiKey.startsWith('sk-')) {
        return { content: '', error: 'Invalid OpenAI API key format.' };
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...(this.organizationId && { 'OpenAI-Organization': this.organizationId }),
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
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
          presence_penalty: 0.2,
          frequency_penalty: 0.2,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return { content: data.choices[0].message.content };
    } catch (error) {
      return this.handleError(error);
    }
  }
}