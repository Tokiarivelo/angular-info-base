/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useAIChatStore } from '@/lib/stores/useAIChatStore';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useAIChatStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useAIChatStore());
    act(() => {
      result.current.clearCurrentSession();
    });
    mockFetch.mockClear();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAIChatStore());

      expect(result.current.currentSession).toBeNull();
      expect(result.current.currentSessionId).toBeNull();
      expect(result.current.sessions).toEqual([]);
      expect(result.current.isLoadingSessions).toBe(false);
      expect(result.current.isLoadingMessages).toBe(false);
      expect(result.current.isSending).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.selectedModel).toBe('gemini-2.0-flash');
      expect(result.current.contentLanguage).toBe('en');
    });
  });

  describe('Model Selection', () => {
    it('should update selected model', () => {
      const { result } = renderHook(() => useAIChatStore());

      act(() => {
        result.current.setSelectedModel('gemini-1.5-pro');
      });

      expect(result.current.selectedModel).toBe('gemini-1.5-pro');
    });
  });

  describe('Content Language', () => {
    it('should update content language', () => {
      const { result } = renderHook(() => useAIChatStore());

      act(() => {
        result.current.setContentLanguage('fr');
      });

      expect(result.current.contentLanguage).toBe('fr');
    });
  });

  describe('Error Handling', () => {
    it('should set and clear errors', () => {
      const { result } = renderHook(() => useAIChatStore());

      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Session Management', () => {
    it('should fetch sessions successfully', async () => {
      const mockSessions = [
        { id: '1', title: 'Session 1', messages: [] },
        { id: '2', title: 'Session 2', messages: [] },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, sessions: mockSessions }),
      });

      const { result } = renderHook(() => useAIChatStore());

      await act(async () => {
        await result.current.fetchSessions();
      });

      expect(result.current.sessions).toEqual(mockSessions);
      expect(result.current.isLoadingSessions).toBe(false);
    });

    it('should handle fetch sessions error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false, error: 'Failed to fetch' }),
      });

      const { result } = renderHook(() => useAIChatStore());

      await act(async () => {
        await result.current.fetchSessions();
      });

      expect(result.current.error).toBe('Failed to fetch');
      expect(result.current.isLoadingSessions).toBe(false);
    });

    it('should create a new session', async () => {
      const newSession = {
        id: 'new-session-id',
        title: 'New Session',
        model: 'gemini-2.0-flash',
        contentLanguage: 'en',
        messages: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, session: newSession }),
      });

      const { result } = renderHook(() => useAIChatStore());

      let createdSession;
      await act(async () => {
        createdSession = await result.current.createSession({
          title: 'New Session',
        });
      });

      expect(createdSession).toEqual(newSession);
      expect(result.current.currentSession).toEqual(newSession);
      expect(result.current.currentSessionId).toBe('new-session-id');
      expect(result.current.sessions).toContainEqual(newSession);
    });

    it('should delete a session', async () => {
      // First, set up a session
      const session = {
        id: 'session-to-delete',
        title: 'Session to Delete',
        messages: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, session }),
      });

      const { result } = renderHook(() => useAIChatStore());

      await act(async () => {
        await result.current.createSession({ title: 'Session to Delete' });
      });

      // Now delete it
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      let deleted;
      await act(async () => {
        deleted = await result.current.deleteSession('session-to-delete');
      });

      expect(deleted).toBe(true);
      expect(result.current.sessions).not.toContainEqual(session);
    });
  });

  describe('Clear Session', () => {
    it('should clear current session', async () => {
      const session = {
        id: 'test-session',
        title: 'Test Session',
        messages: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, session }),
      });

      const { result } = renderHook(() => useAIChatStore());

      await act(async () => {
        await result.current.createSession({ title: 'Test Session' });
      });

      expect(result.current.currentSession).not.toBeNull();

      act(() => {
        result.current.clearCurrentSession();
      });

      expect(result.current.currentSession).toBeNull();
      expect(result.current.currentSessionId).toBeNull();
    });
  });
});
