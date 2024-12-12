import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Settings } from '../settings/Settings';
import { X, Settings as SettingsIcon } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';

export const ChatWindow: React.FC = () => {
  const [showSettings, setShowSettings] = React.useState(false);
  const { isOpen, toggleChat, config } = useChatStore();

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 md:right-4 md:bottom-4 w-full md:w-96 h-[90vh] md:h-[600px] bg-white shadow-2xl flex flex-col rounded-t-lg md:rounded-lg border border-gray-200 transition-all">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          {config.companyName || 'Customer Service'}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
          <button
            onClick={toggleChat}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {showSettings ? (
          <Settings onClose={() => setShowSettings(false)} />
        ) : (
          <>
            <MessageList />
            <div className="border-t border-gray-200 bg-white p-4">
              <MessageInput />
            </div>
          </>
        )}
      </div>
    </div>
  );
};