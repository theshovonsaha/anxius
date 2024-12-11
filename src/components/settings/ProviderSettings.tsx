import React, { useState, useEffect } from 'react';
import { AIProvider, PROVIDER_INFO } from '../../types/ai';
import { APIKeyInput } from './APIKeyInput';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

interface ProviderSettingsProps {
  provider: AIProvider;
  onModelChange?: (model: string) => void;
  onSettingsChange?: (settings: {
    organizationId?: string;
    baseUrl?: string;
  }) => void;
  onValidationChange?: (isValid: boolean) => void; // Add this line
}

export const ProviderSettings: React.FC<ProviderSettingsProps> = ({
  provider,
  onModelChange,
  onSettingsChange,
  onValidationChange,
}) => {
  const [isValid, setIsValid] = useState(false);
  const info = PROVIDER_INFO[provider];
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [model, setModel] = useState(info.defaultModel);
  const [organizationId, setOrganizationId] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Load saved settings
    const savedOrgId = localStorage.getItem(`${provider}_org_id`);
    const savedBaseUrl = localStorage.getItem(`${provider}_base_url`);
    if (savedOrgId) setOrganizationId(savedOrgId);
    if (savedBaseUrl) setBaseUrl(savedBaseUrl);
  }, [provider]);
    

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    setModel(newModel);
    onModelChange?.(newModel);
  };

  const handleOrganizationIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOrgId = e.target.value;
    setOrganizationId(newOrgId);
    localStorage.setItem(`${provider}_org_id`, newOrgId);
    onSettingsChange?.({ organizationId: newOrgId, baseUrl });
  };

  const handleBaseUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBaseUrl = e.target.value;
    setBaseUrl(newBaseUrl);
    localStorage.setItem(`${provider}_base_url`, newBaseUrl);
    onSettingsChange?.({ organizationId, baseUrl: newBaseUrl });
  };

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
          {isValid ? (
            <span className="text-green-600">✓ Configured</span>
          ) : (
            <span className="text-red-600">× Not Configured</span>
          )}
        </div>
      </div>

      <APIKeyInput
  provider={provider}
  onValidationChange={(isValid) => {
    setIsValid(isValid);
    onValidationChange?.(isValid);
  }}
/>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model
        </label>
        <select
          value={model}
          onChange={handleModelChange}
          className="w-full p-2 border rounded-lg bg-white"
          disabled={!isValid}
        >
          {info.models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t pt-4 mt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4">
            {info.requiresOrganizationId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization ID
                </label>
                <input
                  type="text"
                  value={organizationId}
                  onChange={handleOrganizationIdChange}
                  placeholder="Enter organization ID (optional)"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            )}

            {info.requiresBaseUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base URL
                </label>
                <input
                  type="url"
                  value={baseUrl}
                  onChange={handleBaseUrlChange}
                  placeholder="Enter API base URL"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};