import { AIProviderConfig, AIResponse, AIProvider } from '../../../types/ai';
import { BaseAIProvider } from './base';

export class GeminiProvider extends BaseAIProvider {
  private baseUrl: string;

  constructor(provider: AIProvider, config: AIProviderConfig) {
    // Gemini has a default rate limit of 60 requests per minute
    super(provider, config, 60, 60000);
    this.baseUrl = config.baseUrl || 'https://generativelanguage.googleapis.com/v1';
  }

  async generateResponse(message: string, context: string): Promise<AIResponse> {
    try {
      if (!(await this.checkRateLimit())) {
        return { content: '', error: 'Rate limit exceeded. Please try again later.' };
      }

      const response = await fetch(
        `${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: context 
                      ? `As a customer service agent, use this context to help answer: ${context}\n\nQuestion: ${message}`
                      : message
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
              topP: 0.8,
              topK: 40
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              }
            ]
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.promptFeedback?.blockReason) {
        return { 
          content: '', 
          error: `Content blocked: ${data.promptFeedback.blockReason}` 
        };
      }

      if (!data.candidates || data.candidates.length === 0) {
        return {
          content: '',
          error: 'No response generated'
        };
      }

      return { 
        content: data.candidates[0].content.parts[0].text 
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}