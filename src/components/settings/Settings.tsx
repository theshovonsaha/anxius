import React from 'react';
import { useChatStore } from '../../store/chatStore';
import { SettingsField } from './SettingsField';
import { APIKeyInput } from './APIKeyInput';
import { AI_PROVIDERS, formatProviderName } from '../../utils/ai';
import { useSettings } from '../../hooks/useSettings';

export const Settings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { config, setConfig } = useChatStore();
  const { handleFileChange, handleSave } = useSettings(onClose);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Chat Settings</h3>
      
      <div className="space-y-6">
        <SettingsField label="Company Name">
          <input
            type="text"
            value={config.companyName}
            onChange={(e) => setConfig({ companyName: e.target.value })}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter company name"
          />
        </SettingsField>

        <SettingsField 
          label="Welcome Message"
          description="This message will be shown when the chat starts"
        >
          <input
            type="text"
            value={config.welcomeMessage}
            onChange={(e) => setConfig({ welcomeMessage: e.target.value })}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter welcome message"
          />
        </SettingsField>

        <SettingsField 
          label="AI Provider"
          description="Select the AI model to power your chat"
        >
          <select
            value={config.aiProvider}
            onChange={(e) => setConfig({ aiProvider: e.target.value as any })}
            className="w-full p-2 border rounded-lg mb-4"
          >
            {AI_PROVIDERS.map((provider) => (
              <option key={provider} value={provider}>
                {formatProviderName(provider)}
              </option>
            ))}
          </select>
          
          <APIKeyInput provider={config.aiProvider} />
        </SettingsField>

        <SettingsField 
          label="Knowledge Base"
          description="Upload company documents (.pdf, .doc, .docx, .txt)"
        >
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg"
            accept=".pdf,.doc,.docx,.txt"
          />
        </SettingsField>

        <button
          onClick={handleSave}
          className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};