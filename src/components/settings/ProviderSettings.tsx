import React, { useState, useCallback } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { AIProvider, PROVIDER_INFO } from '../../types/ai';
import { APIKeyInput } from './APIKeyInput';
import { SettingsField } from './SettingsField';

interface ProviderSettingsProps {
  provider: AIProvider;
  onModelChange?: (model: string) => void;
  onSettingsChange?: (settings: {
    organizationId?: string;
    baseUrl?: string;
  }) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const ProviderSettings: React.FC<ProviderSettingsProps> = ({
  provider,
  onModelChange,
  onSettingsChange,
  onValidationChange,
}) => {
  const info = PROVIDER_INFO[provider];
  const [state, setState] = useState(() => ({
    isValid: false,
    showAdvanced: false,
    model: localStorage.getItem(`${provider}_model`) || info.defaultModel,
    organizationId: localStorage.getItem(`${provider}_org_id`) || '',
    baseUrl: localStorage.getItem(`${provider}_base_url`) || ''
  }));

  // Memoize handlers to prevent unnecessary re-renders
  const handleModelChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    setState(prev => ({ ...prev, model: newModel }));
    localStorage.setItem(`${provider}_model`, newModel);
    onModelChange?.(newModel);
  }, [provider, onModelChange]);

  const handleOrganizationIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newOrgId = e.target.value;
    setState(prev => ({ ...prev, organizationId: newOrgId }));
    localStorage.setItem(`${provider}_org_id`, newOrgId);
    onSettingsChange?.({ organizationId: newOrgId, baseUrl: state.baseUrl });
  }, [provider, state.baseUrl, onSettingsChange]);

  const handleBaseUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newBaseUrl = e.target.value;
    setState(prev => ({ ...prev, baseUrl: newBaseUrl }));
    localStorage.setItem(`${provider}_base_url`, newBaseUrl);
    onSettingsChange?.({ organizationId: state.organizationId, baseUrl: newBaseUrl });
  }, [provider, state.organizationId, onSettingsChange]);

  const handleValidationChange = useCallback((newIsValid: boolean) => {
    setState(prev => ({ ...prev, isValid: newIsValid }));
    onValidationChange?.(newIsValid);
  }, [onValidationChange]);

  const toggleAdvanced = useCallback(() => {
    setState(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }));
  }, []);

  return (
    <div className="space-y-4 bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-lg">{info.displayName}</h3>
          <div className="relative group">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-white rounded-lg shadow-lg border text-sm z-10">
              <p>{info.description}</p>
              <p className="mt-1">
                Rate limit: {info.rateLimit.requests} requests per{' '}
                {info.rateLimit.window / 1000} seconds
              </p>
              <p className="mt-1">
                Max tokens: {info.maxTokens}
              </p>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {state.isValid ? (
            <span className="text-green-600">✓ Configured</span>
          ) : (
            <span className="text-red-600">× Not Configured</span>
          )}
        </div>
      </div>

      <APIKeyInput
        provider={provider}
        onValidationChange={handleValidationChange}
      />

      <SettingsField 
        label="Model"
        description="Select the AI model to use for this provider"
      >
        <select
          value={state.model}
          onChange={handleModelChange}
          className="w-full p-2 border rounded-lg bg-white"
          disabled={!state.isValid}
        >
          {info.models.map((modelOption) => (
            <option key={modelOption} value={modelOption}>
              {modelOption}
            </option>
          ))}
        </select>
      </SettingsField>

      <div className="border-t pt-4 mt-4">
        <button
          onClick={toggleAdvanced}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          {state.showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {state.showAdvanced ? 'Hide' : 'Show'} Advanced Settings
        </button>

        {state.showAdvanced && (
          <div className="mt-4 space-y-4">
            {info.requiresOrganizationId && (
              <SettingsField 
                label="Organization ID"
                description="Optional: Enter your organization ID if you have one"
              >
                <input
                  type="text"
                  value={state.organizationId}
                  onChange={handleOrganizationIdChange}
                  placeholder="Enter organization ID (optional)"
                  className="w-full p-2 border rounded-lg"
                />
              </SettingsField>
            )}

            {info.requiresBaseUrl && (
              <SettingsField 
                label="Base URL"
                description="Enter your custom API endpoint URL"
              >
                <input
                  type="url"
                  value={state.baseUrl}
                  onChange={handleBaseUrlChange}
                  placeholder="Enter API base URL"
                  className="w-full p-2 border rounded-lg"
                  required={info.requiresBaseUrl}
                />
              </SettingsField>
            )}
          </div>
        )}
      </div>
    </div>
  );
};