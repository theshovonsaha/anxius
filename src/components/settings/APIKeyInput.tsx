import React, { useState, useEffect } from 'react';
import { AIProvider } from '../../types/ai';
import { Eye, EyeOff } from 'lucide-react';
import { AIProviderFactory } from '../../services/ai/factory';

interface APIKeyInputProps {
  provider: AIProvider;
  onValidationChange?: (isValid: boolean) => void;
}

export const APIKeyInput: React.FC<APIKeyInputProps> = ({ provider, onValidationChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem(`${provider}_api_key`);
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, [provider]);

  const handleSave = () => {
    const isValid = AIProviderFactory.validateApiKey(provider, apiKey);
    if (isValid) {
      localStorage.setItem(`${provider}_api_key`, apiKey.trim());
      onValidationChange?.(true);
    } else {
      onValidationChange?.(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={`Enter ${provider} API key`}
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      <button
        onClick={handleSave}
        className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        Save API Key
      </button>
    </div>
  );
};