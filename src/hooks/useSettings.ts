import { useChatStore } from '../store/chatStore';

export const useSettings = (onClose: () => void) => {
  const { setConfig } = useChatStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production, you might want to validate file size and type
      setConfig({ knowledgeBase: file });
    }
  };

  const handleSave = () => {
    // In production, you might want to save settings to backend
    onClose();
  };

  return { handleFileChange, handleSave };
};