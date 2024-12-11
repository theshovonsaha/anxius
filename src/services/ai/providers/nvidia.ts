import { AIProviderConfig, AIResponse, AIProvider } from '../../../types/ai';
import { BaseAIProvider } from './base';

export class NvidiaProvider extends BaseAIProvider {
  private baseUrl: string;

  constructor(provider: AIProvider, config: AIProviderConfig) {
    // NVIDIA's default rate limit
    super(provider, config, 45, 60000);
    this.baseUrl = config.baseUrl || 'https://api.nvcf.nvidia.com/v2/endpoint';
  }

  async generateResponse(message: string, context: string): Promise<AIResponse> {
    try {
      if (!(await this.checkRateLimit())) {
        return { content: '', error: 'Rate limit exceeded. Please try again later.' };
      }

      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: context 
                ? `You are a helpful customer service agent. Use this context to answer questions: ${context}`
                : 'You are a helpful customer service agent.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          config: {
            temperature: 0.7,
            max_tokens: 500,
            top_p: 0.95,
            frequency_penalty: 0.2,
            presence_penalty: 0.2
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`NVIDIA API error: ${response.statusText}`);
      }

      const data = await response.json();
      return { 
        content: data.choices[0].message.content 
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}