import { AIProviderConfig, AIResponse, AIProvider, PROVIDER_INFO } from '../../../types/ai';

export abstract class BaseAIProvider {
  protected apiKey: string;
  protected provider: AIProvider;
  protected requestCounter: { [key: string]: number } = {};
  protected requestTimestamps: { [key: string]: number[] } = {};
  protected rateLimit: number;
  protected rateLimitWindow: number; // in milliseconds

  constructor(provider: AIProvider, config: AIProviderConfig, rateLimit: number = 60, rateLimitWindow: number = 60000) {
    this.provider = provider;
    this.apiKey = config.apiKey;
    this.rateLimit = rateLimit;
    this.rateLimitWindow = rateLimitWindow;
  }

  protected async checkRateLimit(): Promise<boolean> {
    const now = Date.now();
    const key = this.apiKey;
    
    // Initialize if not exists
    if (!this.requestTimestamps[key]) {
      this.requestTimestamps[key] = [];
      this.requestCounter[key] = 0;
    }

    // Remove old timestamps
    this.requestTimestamps[key] = this.requestTimestamps[key].filter(
      timestamp => now - timestamp < this.rateLimitWindow
    );

    // Check if rate limit exceeded
    if (this.requestTimestamps[key].length >= this.rateLimit) {
      return false;
    }

    // Add new timestamp
    this.requestTimestamps[key].push(now);
    this.requestCounter[key]++;

    return true;
  }

  protected async handleError(error: any): Promise<AIResponse> {
    if (error.response) {
      // API error response
      const status = error.response.status;
      switch (status) {
        case 401:
          return { content: '', error: 'Invalid API key. Please check your settings.' };
        case 429:
          return { content: '', error: 'Rate limit exceeded. Please try again later.' };
        case 500:
          return { content: '', error: 'AI service is currently unavailable. Please try again later.' };
        default:
          return { content: '', error: `Service error: ${error.response.statusText}` };
      }
    } else if (error.request) {
      // Network error
      return { content: '', error: 'Network error. Please check your connection.' };
    }
    
    return { content: '', error: error.message || 'An unexpected error occurred.' };
  }

  public validateApiKey(apiKey: string): boolean {
    const info = PROVIDER_INFO[this.provider];
    return apiKey.length > 0 && info.apiKeyPattern.test(apiKey);
  }

  abstract generateResponse(message: string, context: string): Promise<AIResponse>;
}