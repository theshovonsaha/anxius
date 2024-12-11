import { useChatStore } from '../store/chatStore';
import { ChatConfig } from '../types/ai';

export const useSettings = (onClose: () => void) => {
  const { config, setConfig } = useChatStore();

  const handleConfigUpdate = (updates: Partial<ChatConfig>) => {
    setConfig(updates);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Check file type
      const validTypes = ['.pdf', '.doc', '.docx', '.txt'];
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      if (!validTypes.includes(fileExtension)) {
        throw new Error('Invalid file type. Supported types: PDF, DOC, DOCX, TXT');
      }

      setConfig({ knowledgeBase: file });
    }
  };

  const handleSave = () => {
    // Add any additional validation or processing here
    onClose();
  };

  return {
    config,
    handleConfigUpdate,
    handleFileChange,
    handleSave,
  };
};