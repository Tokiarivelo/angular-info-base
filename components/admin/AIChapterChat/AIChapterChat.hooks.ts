import { useState, useCallback, useEffect } from 'react';
import {
  ChatMessage,
  GenerateContentResponse,
  CourseContext,
  GeneratedChapterData,
} from './AIChapterChat.types';
import { EditorBlock } from '../ChapterRichContentEditor/ChapterRichContentEditor.types';
import { useAIChatStore } from '@/lib/stores';
import { AIChatSession } from '@/lib/ai/session.types';

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
  courseId?: string;
  chapterId?: string;
}

/**
 * Hook for managing AI chapter chat state and interactions with session persistence
 */
export function useAIChapterChat(options?: UseAIChapterChatOptions) {
  const { courseContext, courseId, chapterId } = options || {};

  // Get store state and actions
  const {
    currentSession,
    currentSessionId,
    sessions,
    isSending,
    error: storeError,
    selectedModel,
    contentLanguage,
    setSelectedModel,
    setContentLanguage,
    setError,
    fetchSessions,
    fetchSession,
    createSession,
    deleteSession,
    setCurrentSession,
    clearCurrentSession,
  } = useAIChatStore();

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);

  // Convert store messages to component format
  const messages: ChatMessage[] = (currentSession?.messages || []).map(
    (msg) => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      blocks: msg.blocks as EditorBlock[] | undefined,
      chapterTitle: msg.chapterTitle || undefined,
      chapterDescription: msg.chapterDescription || undefined,
      imagePrompt: msg.imagePrompt || undefined,
      timestamp: new Date(msg.createdAt),
      isLoading: msg.isLoading,
    })
  );

  // Load sessions on mount
  useEffect(() => {
    fetchSessions(courseId);
  }, [courseId, fetchSessions]);

  /**
   * Initialize or load a session
   */
  const initSession = useCallback(async () => {
    // If we already have a current session for this context, use it
    if (currentSession) {
      return currentSession;
    }

    // Try to find an existing session for this course/chapter
    const existingSession = sessions.find(
      (s) =>
        (courseId ? s.courseId === courseId : !s.courseId) &&
        (chapterId ? s.chapterId === chapterId : !s.chapterId)
    );

    if (existingSession) {
      await fetchSession(existingSession.id);
      return existingSession;
    }

    // Create a new session
    return await createSession({
      courseId,
      chapterId,
      title: courseContext?.title ? `Chat: ${courseContext.title}` : 'New Chat',
      model: selectedModel,
      contentLanguage,
    });
  }, [
    currentSession,
    sessions,
    courseId,
    chapterId,
    courseContext,
    selectedModel,
    contentLanguage,
    fetchSession,
    createSession,
  ]);

  /**
   * Send a message to the AI and get a response
   */
  const sendMessage = useCallback(
    async (prompt: string, model?: string) => {
      if (!prompt.trim() || isLoading || isSending) return;

      setLocalError(null);
      setInputValue('');
      setIsLoading(true);

      try {
        // Ensure we have a session
        let session = currentSession;
        if (!session) {
          session = await initSession();
          if (!session) {
            throw new Error('Failed to create session');
          }
        }

        // Send message via store
        const response = await fetch('/api/ai/sessions/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session.id,
            prompt,
            model: model || selectedModel,
            contentLanguage,
            courseContext,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to send message');
        }

        // Refresh session to get updated messages
        await fetchSession(session.id);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred';
        setLocalError(errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [
      isLoading,
      isSending,
      currentSession,
      initSession,
      selectedModel,
      contentLanguage,
      courseContext,
      fetchSession,
      setError,
    ]
  );

  /**
   * Clear current session (but don't delete from DB)
   */
  const clearChat = useCallback(() => {
    clearCurrentSession();
    setLocalError(null);
    setInputValue('');
  }, [clearCurrentSession]);

  /**
   * Delete current session from DB
   */
  const deleteCurrentSession = useCallback(async () => {
    if (currentSessionId) {
      await deleteSession(currentSessionId);
      clearChat();
    }
  }, [currentSessionId, deleteSession, clearChat]);

  /**
   * Load a specific session
   */
  const loadSession = useCallback(
    async (sessionId: string) => {
      await fetchSession(sessionId);
    },
    [fetchSession]
  );

  /**
   * Start a new chat session
   */
  const startNewChat = useCallback(async () => {
    clearCurrentSession();
    const newSession = await createSession({
      courseId,
      chapterId,
      title: courseContext?.title ? `Chat: ${courseContext.title}` : 'New Chat',
      model: selectedModel,
      contentLanguage,
    });
    return newSession;
  }, [
    clearCurrentSession,
    createSession,
    courseId,
    chapterId,
    courseContext,
    selectedModel,
    contentLanguage,
  ]);

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
    // Messages and state
    messages,
    isLoading: isLoading || isSending,
    error: error || storeError,
    inputValue,
    setInputValue,

    // Session management
    currentSession,
    currentSessionId,
    sessions,

    // Actions
    sendMessage,
    clearChat,
    deleteCurrentSession,
    loadSession,
    startNewChat,

    // Model and language
    selectedModel,
    setSelectedModel,
    contentLanguage,
    setContentLanguage,

    // Utility functions
    getLastGeneratedBlocks,
    getLastGeneratedChapter,
  };
}
