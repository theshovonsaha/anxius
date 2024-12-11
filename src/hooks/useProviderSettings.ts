import { useState, useEffect } from 'react';
import { AIProvider, PROVIDER_INFO } from '../types/ai';

interface ProviderSettings {
  apiKey: string;
  model: string;
  organizationId?: string;
  baseUrl?: string;
}

interface UseProviderSettingsReturn {
  settings: ProviderSettings;
  isConfigured: boolean;
  updateSettings: (updates: Partial<ProviderSettings>) => void;
  validateSettings: () => { isValid: boolean; error?: string };
  clearSettings: () => void;
}

export const useProviderSettings = (provider: AIProvider): UseProviderSettingsReturn => {
  const info = PROVIDER_INFO[provider];
  
  const [settings, setSettings] = useState<ProviderSettings>({
    apiKey: '',
    model: info.defaultModel,
  });

  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Load saved settings when provider changes
    const savedApiKey = localStorage.getItem(`${provider}_api_key`);
    const savedModel = localStorage.getItem(`${provider}_model`) || info.defaultModel;
    const savedOrgId = localStorage.getItem(`${provider}_org_id`);
    const savedBaseUrl = localStorage.getItem(`${provider}_base_url`);

    const newSettings = {
      apiKey: savedApiKey || '',
      model: savedModel,
      ...(savedOrgId && { organizationId: savedOrgId }),
      ...(savedBaseUrl && { baseUrl: savedBaseUrl }),
    };

    setSettings(newSettings);
    setIsConfigured(Boolean(savedApiKey));
  }, [provider, info.defaultModel]);

  const updateSettings = (updates: Partial<ProviderSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    // Save to localStorage
    if (updates.apiKey) {
      localStorage.setItem(`${provider}_api_key`, updates.apiKey);
    }
    if (updates.model) {
      localStorage.setItem(`${provider}_model`, updates.model);
    }
    if (updates.organizationId !== undefined) {
      if (updates.organizationId) {
        localStorage.setItem(`${provider}_org_id`, updates.organizationId);
      } else {
        localStorage.removeItem(`${provider}_org_id`);
      }
    }
    if (updates.baseUrl !== undefined) {
      if (updates.baseUrl) {
        localStorage.setItem(`${provider}_base_url`, updates.baseUrl);
      } else {
        localStorage.removeItem(`${provider}_base_url`);
      }
    }

    setIsConfigured(Boolean(newSettings.apiKey));
  };

  const validateSettings = () => {
    // Check API key format
    if (!info.apiKeyPattern.test(settings.apiKey)) {
      return {
        isValid: false,
        error: `Invalid API key format. Expected format: ${info.apiKeyFormat}`,
      };
    }

    // Check required fields
    if (info.requiresBaseUrl && !settings.baseUrl) {
      return {
        isValid: false,
        error: 'Base URL is required',
      };
    }

    // Validate model
    if (!info.models.includes(settings.model)) {
      return {
        isValid: false,
        error: 'Invalid model selected',
      };
    }

    return { isValid: true };
  };

  const clearSettings = () => {
    localStorage.removeItem(`${provider}_api_key`);
    localStorage.removeItem(`${provider}_model`);
    localStorage.removeItem(`${provider}_org_id`);
    localStorage.removeItem(`${provider}_base_url`);

    setSettings({
      apiKey: '',
      model: info.defaultModel,
    });
    setIsConfigured(false);
  };

  return {
    settings,
    isConfigured,
    updateSettings,
    validateSettings,
    clearSettings,
  };
};