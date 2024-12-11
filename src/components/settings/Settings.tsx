import React, { useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import { ProviderSettings } from './ProviderSettings';
import { useProviderSettings } from '../../hooks/useProviderSettings';
import { PROVIDER_INFO } from '../../types/ai';
import { X, AlertCircle } from 'lucide-react';

interface SettingsProps {
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { config, setConfig } = useChatStore();
  const { settings, updateSettings, validateSettings } = useProviderSettings(config.aiProvider);
  const [error, setError] = useState<string | null>(null);

  const handleProviderChange = (provider: string) => {
      setConfig({ aiProvider: provider as keyof typeof PROVIDER_INFO });
  };

  const handleModelChange = (model: string) => {
    updateSettings({ model });
  };

  const handleSettingsChange = (updates: { organizationId?: string; baseUrl?: string }) => {
    updateSettings(updates);
  };
const handleValidationChange = (isValid: boolean) => {
    if (!isValid) {
      setError('Invalid API key configuration');
    } else {
      setError(null);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Check file type
      const validTypes = ['.pdf', '.doc', '.docx', '.txt'];
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      if (!validTypes.includes(fileExtension)) {
        setError('Invalid file type. Supported types: PDF, DOC, DOCX, TXT');
        return;
      }

      setConfig({ knowledgeBase: file });
      setError(null);
    }
  };

  const handleSave = () => {
    const validation = validateSettings();
    if (!validation.isValid) {
      setError(validation.error ?? null);
      return;
    }

    // Save all settings
    setConfig({
      ...config,
      aiProvider: config.aiProvider,
      model: settings.model,
    });

    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 py-3 border-b bg-white">
        <h3 className="text-lg font-semibold">Chat Settings</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Company Info */}
        <section className="bg-white rounded-lg border p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Company Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Company Name</label>
              <input
                type="text"
                value={config.companyName}
                onChange={(e) => setConfig({ companyName: e.target.value })}
                placeholder="Enter company name"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Welcome Message</label>
              <input
                type="text"
                value={config.welcomeMessage}
                onChange={(e) => setConfig({ welcomeMessage: e.target.value })}
                placeholder="Enter welcome message"
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* AI Provider Settings */}
        <section className="bg-white rounded-lg border p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-4">AI Provider</h4>
          <div className="space-y-4">
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

            <ProviderSettings
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
                  onClick={() => setConfig({ knowledgeBase: null })}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="border-t p-4 bg-white">
        <button
          onClick={handleSave}
          className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};