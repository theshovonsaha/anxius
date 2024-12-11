import { AIProviderConfig, AIResponse } from '../../../types/ai';

export class ClaudeProvider {
  private apiKey: string;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
  }

  async generateResponse(message: string, context: string): Promise<AIResponse> {
    try {
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
      return { content: '', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}