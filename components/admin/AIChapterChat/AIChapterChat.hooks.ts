import { useState, useCallback } from 'react';
import {
  ChatMessage,
  GenerateContentResponse,
  CourseContext,
  GeneratedChapterData,
} from './AIChapterChat.types';
import { EditorBlock } from '../ChapterRichContentEditor/ChapterRichContentEditor.types';

/**
 * Generate a unique ID for messages
 */
const generateMessageId = () =>
  `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Generate a unique ID for blocks
 */
const generateBlockId = () =>
  `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Hook options
 */
interface UseAIChapterChatOptions {
  courseContext?: CourseContext;
}

/**
 * Hook for managing AI chapter chat state and interactions
 */
export function useAIChapterChat(options?: UseAIChapterChatOptions) {
  const { courseContext } = options || {};

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  /**
   * Send a message to the AI and get a response
   */
  const sendMessage = useCallback(
    async (prompt: string) => {
      if (!prompt.trim() || isLoading) return;

      setError(null);
      setInputValue('');

      // Add user message
      const userMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'user',
        content: prompt,
        timestamp: new Date(),
      };

      // Add loading message for assistant
      const loadingMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true,
      };

      setMessages((prev) => [...prev, userMessage, loadingMessage]);
      setIsLoading(true);

      try {
        // Build conversation history for context
        const conversationHistory = messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        const response = await fetch('/api/ai/generate-chapter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            conversationHistory,
            courseContext,
          }),
        });

        const data: GenerateContentResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate content');
        }

        // Process blocks to ensure they have valid IDs
        let processedBlocks: EditorBlock[] | undefined;
        if (data.blocks && Array.isArray(data.blocks)) {
          processedBlocks = data.blocks.map((block: any) => ({
            id: generateBlockId(),
            type: block.type || 'richText',
            content: block.content || '',
            title: block.title,
          }));
        }

        // Update the loading message with the actual response including metadata
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessage.id
              ? {
                  ...msg,
                  content: data.message,
                  blocks: processedBlocks,
                  chapterTitle: data.chapterTitle,
                  chapterDescription: data.chapterDescription,
                  imagePrompt: data.imagePrompt,
                  isLoading: false,
                }
              : msg
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Remove the loading message on error
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== loadingMessage.id)
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, courseContext]
  );

  /**
   * Clear all messages and reset the chat
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setInputValue('');
  }, []);

  /**
   * Get the last generated blocks from the conversation
   */
  const getLastGeneratedBlocks = useCallback((): EditorBlock[] | null => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant' && messages[i].blocks) {
        return messages[i].blocks || null;
      }
    }
    return null;
  }, [messages]);

  /**
   * Get the last generated chapter data (including metadata) from the conversation
   */
  const getLastGeneratedChapter =
    useCallback((): GeneratedChapterData | null => {
      for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];
        if (msg.role === 'assistant' && msg.blocks) {
          return {
            title: msg.chapterTitle,
            description: msg.chapterDescription,
            imageUrl: undefined, // Will be set after image generation
            blocks: msg.blocks,
          };
        }
      }
      return null;
    }, [messages]);

  return {
    messages,
    isLoading,
    error,
    inputValue,
    setInputValue,
    sendMessage,
    clearChat,
    getLastGeneratedBlocks,
    getLastGeneratedChapter,
  };
}
