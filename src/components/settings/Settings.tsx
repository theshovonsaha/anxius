import React, { useState, useCallback } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { PROVIDER_INFO, AIProvider } from '../../types/ai';
import { ProviderSettings } from './ProviderSettings';
import { useProviderSettings } from '../../hooks/useProviderSettings';
import { useSettings } from '../../hooks/useSettings';
import { SettingsField } from './SettingsField';

interface SettingsProps {
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { config, handleConfigUpdate, handleFileChange, handleSave } = useSettings(onClose);
  const { settings, updateSettings, validateSettings } = useProviderSettings(config.aiProvider);
  const [error, setError] = useState<string | null>(null);

  const handleProviderChange = useCallback((provider: string) => {
    setError(null);
    handleConfigUpdate({ aiProvider: provider as AIProvider });
  }, [handleConfigUpdate]);

  const handleModelChange = useCallback((model: string) => {
    updateSettings({ model });
  }, [updateSettings]);

  const handleSettingsChange = useCallback((updates: { organizationId?: string; baseUrl?: string }) => {
    updateSettings(updates);
  }, [updateSettings]);

  const handleValidationChange = useCallback((isValid: boolean) => {
    setError(isValid ? null : 'Invalid API key configuration');
  }, []);

  const handleSubmit = () => {
    try {
      const validation = validateSettings();
      if (!validation.isValid) {
        setError(validation.error ?? 'Invalid settings');
        return;
      }

      handleConfigUpdate({
        aiProvider: config.aiProvider,
        model: settings.model,
      });

      handleSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving settings');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b bg-white">
        <h3 className="text-lg font-semibold">Chat Settings</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Company Information */}
        <section className="bg-white rounded-lg border p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Company Information</h4>
          <div className="space-y-4">
            <SettingsField label="Company Name">
              <input
                type="text"
                value={config.companyName}
                onChange={(e) => handleConfigUpdate({ companyName: e.target.value })}
                placeholder="Enter company name"
                className="w-full p-2 border rounded-lg"
              />
            </SettingsField>

            <SettingsField label="Welcome Message">
              <input
                type="text"
                value={config.welcomeMessage}
                onChange={(e) => handleConfigUpdate({ welcomeMessage: e.target.value })}
                placeholder="Enter welcome message"
                className="w-full p-2 border rounded-lg"
              />
            </SettingsField>
          </div>
        </section>

        {/* AI Provider Settings */}
        <section className="bg-white rounded-lg border p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-4">AI Provider</h4>
          <div className="space-y-4">
            <SettingsField label="Select Provider">
              <select
                value={config.aiProvider}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {Object.entries(PROVIDER_INFO).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.displayName}
                  </option>
                ))}
              </select>
            </SettingsField>

            <ProviderSettings
              key={config.aiProvider} // Add key to force re-mount on provider change
              provider={config.aiProvider}
              onModelChange={handleModelChange}
              onSettingsChange={handleSettingsChange}
              onValidationChange={handleValidationChange}
            />
          </div>
        </section>

        {/* Knowledge Base */}
        <section className="bg-white rounded-lg border p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Knowledge Base</h4>
          <div className="space-y-2">
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg"
              accept=".pdf,.doc,.docx,.txt"
            />
            <p className="text-xs text-gray-500">
              Supported formats: PDF, DOC, DOCX, TXT (max 5MB)
            </p>
            {config.knowledgeBase && (
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-600">
                  {config.knowledgeBase.name}
                </span>
                <button
                  onClick={() => handleConfigUpdate({ knowledgeBase: null })}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="border-t p-4 bg-white">
        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};