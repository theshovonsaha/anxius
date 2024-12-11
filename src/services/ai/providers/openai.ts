import { AIProviderConfig, AIResponse } from '../../../types/ai';

export class OpenAIProvider {
  private apiKey: string;
  private organizationId?: string;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
    this.organizationId = config.organizationId;
  }

  async generateResponse(message: string, context: string): Promise<AIResponse> {
    try {
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
            { role: 'system', content: `You are a helpful customer service agent. Use this context to answer questions: ${context}` },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return { content: data.choices[0].message.content };
    } catch (error) {
      return { content: '', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}