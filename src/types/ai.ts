// src/types/ai.ts

export type AIProvider = 'claude' | 'openai' | 'mistral' | 'gemini' | 'nvidia';

export interface AIProviderConfig {
  apiKey: string;
  organizationId?: string;
  baseUrl?: string;
  model?: string;
}

export interface AIProviderInfo {
  name: AIProvider;
  displayName: string;
  description: string;
  apiKeyPattern: RegExp;
  apiKeyFormat: string;
  defaultModel: string;
  models: string[];
  supportsStreaming: boolean;
  requiresOrganizationId?: boolean;
  requiresBaseUrl?: boolean;
  maxTokens: number;
  rateLimit: {
    requests: number;
    window: number; // in milliseconds
  };
}

export const PROVIDER_INFO: Record<AIProvider, AIProviderInfo> = {
  openai: {
    name: 'openai',
    displayName: 'OpenAI',
    description: 'Powerful language models including GPT-4 and GPT-3.5',
    apiKeyPattern: /^sk-[a-zA-Z0-9]{32,}$/,
    apiKeyFormat: 'sk-... (48+ characters)',
    defaultModel: 'gpt-4-turbo-preview',
    models: ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo'],
    supportsStreaming: true,
    requiresOrganizationId: true,
    maxTokens: 4096,
    rateLimit: {
      requests: 60,
      window: 60000
    }
  },
  claude: {
    name: 'claude',
    displayName: 'Claude (Anthropic)',
    description: 'Advanced AI assistant with strong reasoning capabilities',
    apiKeyPattern: /^sk-[a-zA-Z0-9]{40,}$/,
    apiKeyFormat: 'sk-... (48+ characters)',
    defaultModel: 'claude-3-opus-20240229',
    models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229'],
    supportsStreaming: true,
    maxTokens: 4096,
    rateLimit: {
      requests: 50,
      window: 60000
    }
  },
  mistral: {
    name: 'mistral',
    displayName: 'Mistral AI',
    description: 'Open-source language models with strong performance',
    apiKeyPattern: /^[a-zA-Z0-9]{32,}$/,
    apiKeyFormat: '32+ character key',
    defaultModel: 'mistral-large-latest',
    models: ['mistral-large-latest', 'mistral-medium', 'mistral-small'],
    supportsStreaming: true,
    maxTokens: 4096,
    rateLimit: {
      requests: 100,
      window: 60000
    }
  },
  gemini: {
    name: 'gemini',
    displayName: 'Google Gemini',
    description: 'Google\'s most capable language model',
    apiKeyPattern: /^[a-zA-Z0-9-_]{39}$/,
    apiKeyFormat: '39-character API key',
    defaultModel: 'gemini-pro',
    models: ['gemini-pro'],
    supportsStreaming: true,
    maxTokens: 2048,
    rateLimit: {
      requests: 60,
      window: 60000
    }
  },
  nvidia: {
    name: 'nvidia',
    displayName: 'NVIDIA AI Foundation',
    description: 'NVIDIA\'s enterprise-grade language models',
    apiKeyPattern: /^[a-zA-Z0-9-_]{64}$/,
    apiKeyFormat: '64-character API key',
    defaultModel: 'llama2-70b',
    models: ['llama2-70b', 'mixtral-8x7b'],
    supportsStreaming: true,
    requiresBaseUrl: true,
    maxTokens: 4096,
    rateLimit: {
      requests: 45,
      window: 60000
    }
  }
};

export interface AIResponse {
  content: string;
  error?: string;
  metadata?: {
    model: string;
    provider: string;
    tokensUsed?: number;
    completionTokens?: number;
    promptTokens?: number;
    totalTokens?: number;
    finishReason?: string;
    latency?: number;
  };
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  streaming?: boolean;
}

export interface AIStreamResponse extends AIResponse {
  streaming: true;
  onToken: (token: string) => void;
  onComplete: (response: AIResponse) => void;
  onError: (error: string) => void;
}

export interface AIRequestOptions {
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
  model?: string;
}

export interface AIProviderResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata?: {
    finishReason?: string;
    model?: string;
  };
}

// types/ai.ts (add this interface with the existing interfaces)
export interface KnowledgeBase {
  id: string;
  content: string;
  metadata: {
    filename: string;
    uploadedAt: Date;
    type: string;
  };
}