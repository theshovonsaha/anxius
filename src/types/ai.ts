export interface AIProviderConfig {
  apiKey: string;
  organizationId?: string; // For OpenAI
  baseUrl?: string; // For self-hosted models
}

export interface AIResponse {
  content: string;
  error?: string;
}

export interface KnowledgeBase {
  id: string;
  content: string;
  metadata: {
    filename: string;
    uploadedAt: Date;
    type: string;
  };
}