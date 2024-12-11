import { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { AIProviderFactory } from '../services/ai/factory';
import { KnowledgeBaseService } from '../services/knowledge';
import { createMessage } from '../utils/message';
import { useProviderSettings } from '../hooks/useProviderSettings';


export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { config, addMessage } = useChatStore();
  const { settings } = useProviderSettings(config.aiProvider);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    setIsLoading(true);

    try {
      // Add user message
      const userMessage = createMessage(content.trim(), 'user');
      addMessage(userMessage);

      // Use settings from useProviderSettings
      if (!settings.apiKey) {
        throw new Error(`Please configure your ${config.aiProvider} API key in settings`);
      }

      // Show typing indicator
      addMessage(createMessage('...', 'ai'));

      // Get context from knowledge base if available
      let context = '';
      if (config.knowledgeBase) {
        try {
          const kb = await KnowledgeBaseService.addDocument(config.knowledgeBase);
          context = await KnowledgeBaseService.getRelevantContext(content, kb);
        } catch (error) {
          console.error('Knowledge base error:', error);
          // Continue without context if there's an error
        }
      }

      // Create AI provider instance
      const provider = AIProviderFactory.createProvider(config.aiProvider, {
        apiKey: settings.apiKey,
        model: settings.model,
        organizationId: settings.organizationId,
        baseUrl: settings.baseUrl
      });

      // Generate AI response
      const response = await provider.generateResponse(content, context);
      
      // Remove typing indicator
      const messages = useChatStore.getState().messages;
      const typingIndex = messages.findIndex(m => m.content === '...' && m.sender === 'ai');
      if (typingIndex !== -1) {
        useChatStore.setState({
          messages: messages.filter((_, index) => index !== typingIndex)
        });
      }

      if (response.error) {
        throw new Error(response.error);
      }

      // Add AI response
      addMessage(createMessage(response.content, 'ai'));
    } catch (error) {
      // Remove typing indicator if it exists
      const messages = useChatStore.getState().messages;
      const typingIndex = messages.findIndex(m => m.content === '...' && m.sender === 'ai');
      if (typingIndex !== -1) {
        useChatStore.setState({
          messages: messages.filter((_, index) => index !== typingIndex)
        });
      }

      // Add error message
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