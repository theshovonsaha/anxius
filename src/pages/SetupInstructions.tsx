import { FC } from 'react';
import { ChevronRight, Key, Settings, MessageSquare } from 'lucide-react';

interface Provider {
  name: string;
  url: string;
  keyFormat: string;
}

const SetupInstructions: FC = () => {
  const providers: Provider[] = [
    { name: 'OpenAI', url: 'https://platform.openai.com/api-keys', keyFormat: 'sk-...' },
    { name: 'Claude', url: 'https://console.anthropic.com/account/keys', keyFormat: 'sk-...' },
    { name: 'Mistral', url: 'https://console.mistral.ai/api-keys/', keyFormat: '...' },
    { name: 'Google Gemini', url: 'https://makersuite.google.com/app/apikey', keyFormat: '...' },
    { name: 'NVIDIA AI', url: 'https://ngc.nvidia.com/setup/api-key', keyFormat: '...' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Anxius | AI Customer Service Chat Demo
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    Click the chat button in the bottom right corner to start a conversation.
                  </p>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Getting Started</h2>
      
      <div className="space-y-8">
        {/* Step 1 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Key className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-medium text-gray-800 mb-2">1. Get an API Key</h3>
            <p className="text-gray-600 mb-4">Choose an AI provider and get your API key:</p>
            <ul className="space-y-3">
              {providers.map((provider) => (
                <li key={provider.name} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <a
                    href={provider.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {provider.name}
                  </a>
                  <span className="text-gray-500 text-sm">({provider.keyFormat})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Settings className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-medium text-gray-800 mb-2">2. Configure the Chat</h3>
            <ol className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="font-medium">a.</span>
                <span>Click the chat button in the bottom right corner</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">b.</span>
                <span>Click the settings icon in the chat header</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">c.</span>
                <span>Select your preferred AI provider and enter your API key</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">d.</span>
                <span>Optionally, customize the company name and welcome message</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-medium text-gray-800 mb-2">3. Start Chatting!</h3>
            <p className="text-gray-600">
              Once configured, you can start chatting with the AI assistant. The assistant will use your selected provider and any knowledge base you've uploaded to provide relevant responses.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Note:</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• API keys are stored securely in your browser's local storage</li>
          <li>• You can upload custom knowledge base documents (PDF, DOC, TXT) up to 5MB</li>
          <li>• Different providers have different rate limits and capabilities</li>
          <li>• All conversations are private and not stored on any server</li>
        </ul>
      </div>
    </div>
  );
};

export default SetupInstructions;