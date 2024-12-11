import { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { AIProviderFactory } from '../services/ai/factory';
import { KnowledgeBaseService } from '../services/knowledge';
import { createMessage } from '../utils/message';

export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { config, addMessage } = useChatStore();

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    setIsLoading(true);

    try {
      // Add user message
      addMessage(createMessage(content.trim(), 'user'));

      // Get API configuration
      const apiKey = localStorage.getItem(`${config.aiProvider}_api_key`);
      if (!apiKey) {
        throw new Error('API key not configured');
      }

      // Create AI provider instance
      const provider = AIProviderFactory.createProvider(config.aiProvider, { apiKey });

      // Get context from knowledge base if available
      let context = '';
      if (config.knowledgeBase) {
        const kb = await KnowledgeBaseService.addDocument(config.knowledgeBase);
        context = await KnowledgeBaseService.getRelevantContext(content, kb);
      }

      // Generate AI response
      const response = await provider.generateResponse(content, context);
      
      if (response.error) {
        throw new Error(response.error);
      }

      // Add AI response
      addMessage(createMessage(response.content, 'ai'));
    } catch (error) {
      addMessage(
        createMessage(
          `Error: ${error instanceof Error ? error.message : 'Failed to generate response'}`,
          'ai'
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading };
};