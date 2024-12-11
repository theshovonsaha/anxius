import React from 'react';
import { useChatStore } from '../store/chatStore';
import { AIProvider } from '../types';

const AI_PROVIDERS: AIProvider[] = ['claude', 'openai', 'mistral', 'gemini', 'nvidia'];

export const Settings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { config, setConfig } = useChatStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setConfig({ knowledgeBase: file });
    }
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Chat Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={config.companyName}
            onChange={(e) => setConfig({ companyName: e.target.value })}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Welcome Message
          </label>
          <input
            type="text"
            value={config.welcomeMessage}
            onChange={(e) => setConfig({ welcomeMessage: e.target.value })}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter welcome message"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            AI Provider
          </label>
          <select
            value={config.aiProvider}
            onChange={(e) => setConfig({ aiProvider: e.target.value as AIProvider })}
            className="w-full p-2 border rounded-lg"
          >
            {AI_PROVIDERS.map((provider) => (
              <option key={provider} value={provider}>
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Knowledge Base
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg"
            accept=".pdf,.doc,.docx,.txt"
          />
        </div>

        <button
          onClick={onClose}
          className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};