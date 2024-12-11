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
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
        <h2 className="text-lg font-semibold">{config.companyName || 'Customer Service'}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
          <button
            onClick={toggleChat}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showSettings ? (
        <Settings onClose={() => setShowSettings(false)} />
      ) : (
        <>
          <MessageList />
          <MessageInput />
        </>
      )}
    </div>
  );
};