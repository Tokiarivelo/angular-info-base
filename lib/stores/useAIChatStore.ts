import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AIChatSession,
  AIChatMessageData,
  CreateSessionPayload,
} from '@/lib/ai/session.types';
import { EditorBlock } from '@/components/admin/ChapterRichContentEditor/ChapterRichContentEditor.types';

interface AIChatStoreState {
  // Current active session
  currentSessionId: string | null;
  currentSession: AIChatSession | null;

  // All sessions for quick switching
  sessions: AIChatSession[];

  // Loading states
  isLoadingSessions: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;

  // Error state
  error: string | null;

  // Preferences
  selectedModel: string;
  contentLanguage: 'en' | 'fr';

  // Actions
  setSelectedModel: (model: string) => void;
  setContentLanguage: (lang: 'en' | 'fr') => void;
  setError: (error: string | null) => void;

  // Session management
  fetchSessions: (courseId?: string) => Promise<void>;
  fetchSession: (sessionId: string) => Promise<AIChatSession | null>;
  createSession: (
    payload: CreateSessionPayload
  ) => Promise<AIChatSession | null>;
  deleteSession: (sessionId: string) => Promise<boolean>;
  setCurrentSession: (session: AIChatSession | null) => void;

  // Message management
  sendMessage: (prompt: string) => Promise<AIChatMessageData | null>;
  addLocalMessage: (message: AIChatMessageData) => void;
  updateLocalMessage: (
    messageId: string,
    updates: Partial<AIChatMessageData>
  ) => void;
  clearCurrentSession: () => void;
}

const generateMessageId = () =>
  `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useAIChatStore = create<AIChatStoreState>()(
  persist(
    (set, get) => ({
      currentSessionId: null,
      currentSession: null,
      sessions: [],
      isLoadingSessions: false,
      isLoadingMessages: false,
      isSending: false,
      error: null,
      selectedModel: 'gemini-2.0-flash',
      contentLanguage: 'en',

      setSelectedModel: (model) => set({ selectedModel: model }),
      setContentLanguage: (lang) => set({ contentLanguage: lang }),
      setError: (error) => set({ error }),

      fetchSessions: async (courseId) => {
        set({ isLoadingSessions: true, error: null });
        try {
          const url = courseId
            ? `/api/ai/sessions?courseId=${courseId}`
            : '/api/ai/sessions';
          const response = await fetch(url);
          const data = await response.json();

          if (data.success) {
            set({ sessions: data.sessions || [] });
          } else {
            set({ error: data.error || 'Failed to fetch sessions' });
          }
        } catch (error) {
          set({ error: 'Network error while fetching sessions' });
        } finally {
          set({ isLoadingSessions: false });
        }
      },

      fetchSession: async (sessionId) => {
        set({ isLoadingMessages: true, error: null });
        try {
          const response = await fetch(`/api/ai/sessions/${sessionId}`);
          const data = await response.json();

          if (data.success && data.session) {
            set({
              currentSession: data.session,
              currentSessionId: data.session.id,
              selectedModel: data.session.model,
              contentLanguage: data.session.contentLanguage as 'en' | 'fr',
            });
            return data.session;
          } else {
            set({ error: data.error || 'Failed to fetch session' });
            return null;
          }
        } catch (error) {
          set({ error: 'Network error while fetching session' });
          return null;
        } finally {
          set({ isLoadingMessages: false });
        }
      },

      createSession: async (payload) => {
        set({ isLoadingSessions: true, error: null });
        try {
          const { selectedModel, contentLanguage } = get();
          const response = await fetch('/api/ai/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...payload,
              model: payload.model || selectedModel,
              contentLanguage: payload.contentLanguage || contentLanguage,
            }),
          });
          const data = await response.json();

          if (data.success && data.session) {
            set((state) => ({
              sessions: [data.session, ...state.sessions],
              currentSession: data.session,
              currentSessionId: data.session.id,
            }));
            return data.session;
          } else {
            set({ error: data.error || 'Failed to create session' });
            return null;
          }
        } catch (error) {
          set({ error: 'Network error while creating session' });
          return null;
        } finally {
          set({ isLoadingSessions: false });
        }
      },

      deleteSession: async (sessionId: string) => {
        try {
          const response = await fetch(`/api/ai/sessions/${sessionId}`, {
            method: 'DELETE',
          });
          const data = await response.json();

          if (data.success) {
            set((state) => {
              const newSessions = state.sessions.filter(
                (s) => s.id !== sessionId
              );
              const newCurrentSession =
                state.currentSessionId === sessionId
                  ? null
                  : state.currentSession;
              const newCurrentSessionId =
                state.currentSessionId === sessionId
                  ? null
                  : state.currentSessionId;

              return {
                sessions: newSessions,
                currentSession: newCurrentSession,
                currentSessionId: newCurrentSessionId,
              };
            });
            return true;
          }
          return false;
        } catch (error) {
          set({ error: 'Failed to delete session' });
          return false;
        }
      },

      setCurrentSession: (session) => {
        set({
          currentSession: session,
          currentSessionId: session?.id || null,
          selectedModel: session?.model || 'gemini-2.0-flash',
          contentLanguage: (session?.contentLanguage as 'en' | 'fr') || 'en',
        });
      },

      sendMessage: async (prompt) => {
        const {
          currentSession,
          selectedModel,
          contentLanguage,
          currentSessionId,
        } = get();

        if (!prompt.trim()) return null;

        set({ isSending: true, error: null });

        // Add user message locally
        const userMessage: AIChatMessageData = {
          id: generateMessageId(),
          sessionId: currentSessionId || 'temp',
          role: 'user',
          content: prompt,
          createdAt: new Date(),
        };

        // Add loading message for assistant
        const loadingMessage: AIChatMessageData = {
          id: generateMessageId(),
          sessionId: currentSessionId || 'temp',
          role: 'assistant',
          content: '',
          createdAt: new Date(),
          isLoading: true,
        };

        set((state) => ({
          currentSession: state.currentSession
            ? {
                ...state.currentSession,
                messages: [
                  ...(state.currentSession.messages || []),
                  userMessage,
                  loadingMessage,
                ],
              }
            : null,
        }));

        try {
          const response = await fetch('/api/ai/sessions/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: currentSessionId,
              prompt,
              model: selectedModel,
              contentLanguage,
              courseContext: currentSession?.courseId
                ? { courseId: currentSession.courseId }
                : undefined,
            }),
          });

          const data = await response.json();

          if (data.success) {
            // Update the session with new messages from server
            set((state) => {
              if (!state.currentSession) return state;

              // Replace loading message with actual response
              const updatedMessages = state.currentSession.messages.map(
                (msg) =>
                  msg.id === loadingMessage.id
                    ? {
                        ...msg,
                        id: data.message?.id || msg.id,
                        content: data.message?.content || '',
                        blocks: data.blocks,
                        chapterTitle: data.chapterTitle,
                        chapterDescription: data.chapterDescription,
                        imagePrompt: data.imagePrompt,
                        isLoading: false,
                      }
                    : msg
              );

              // Update user message ID if server returned it
              if (data.userMessageId) {
                const userMsgIdx = updatedMessages.findIndex(
                  (m) => m.id === userMessage.id
                );
                if (userMsgIdx >= 0) {
                  updatedMessages[userMsgIdx] = {
                    ...updatedMessages[userMsgIdx],
                    id: data.userMessageId,
                  };
                }
              }

              return {
                currentSession: {
                  ...state.currentSession,
                  messages: updatedMessages,
                },
              };
            });

            return data.message;
          } else {
            // Remove loading message on error
            set((state) => ({
              currentSession: state.currentSession
                ? {
                    ...state.currentSession,
                    messages: state.currentSession.messages.filter(
                      (msg) => msg.id !== loadingMessage.id
                    ),
                  }
                : null,
              error: data.error || 'Failed to send message',
            }));
            return null;
          }
        } catch (error) {
          // Remove loading message on error
          set((state) => ({
            currentSession: state.currentSession
              ? {
                  ...state.currentSession,
                  messages: state.currentSession.messages.filter(
                    (msg) => msg.id !== loadingMessage.id
                  ),
                }
              : null,
            error: 'Network error while sending message',
          }));
          return null;
        } finally {
          set({ isSending: false });
        }
      },

      addLocalMessage: (message) => {
        set((state) => ({
          currentSession: state.currentSession
            ? {
                ...state.currentSession,
                messages: [...(state.currentSession.messages || []), message],
              }
            : null,
        }));
      },

      updateLocalMessage: (messageId, updates) => {
        set((state) => ({
          currentSession: state.currentSession
            ? {
                ...state.currentSession,
                messages: state.currentSession.messages.map((msg) =>
                  msg.id === messageId ? { ...msg, ...updates } : msg
                ),
              }
            : null,
        }));
      },

      clearCurrentSession: () => {
        set({
          currentSession: null,
          currentSessionId: null,
        });
      },
    }),
    {
      name: 'ai-chat-storage',
      partialize: (state) => ({
        selectedModel: state.selectedModel,
        contentLanguage: state.contentLanguage,
      }),
    }
  )
);
