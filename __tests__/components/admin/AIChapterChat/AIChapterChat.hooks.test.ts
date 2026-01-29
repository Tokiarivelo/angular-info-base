import { renderHook, act, waitFor } from '@testing-library/react';
import { useAIChapterChat } from '@/components/admin/AIChapterChat/AIChapterChat.hooks';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useAIChapterChat', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('initialization', () => {
    it('should initialize with empty messages', () => {
      const { result } = renderHook(() => useAIChapterChat());

      expect(result.current.messages).toHaveLength(0);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.inputValue).toBe('');
    });
  });

  describe('sendMessage', () => {
    it('should add user message and update loading state', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'Test response',
            blocks: [{ type: 'richText', content: 'Test content' }],
            success: true,
          }),
      });

      const { result } = renderHook(() => useAIChapterChat());

      act(() => {
        result.current.sendMessage('Test prompt');
      });

      // Should have user message and loading message
      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[0].role).toBe('user');
      expect(result.current.messages[0].content).toBe('Test prompt');
      expect(result.current.isLoading).toBe(true);

      // Wait for the response
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should have user message and assistant response
      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[1].role).toBe('assistant');
      expect(result.current.messages[1].content).toBe('Test response');
      expect(result.current.messages[1].blocks).toBeDefined();
    });

    it('should not send empty messages', async () => {
      const { result } = renderHook(() => useAIChapterChat());

      act(() => {
        result.current.sendMessage('');
      });

      expect(result.current.messages).toHaveLength(0);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should not send messages while loading', async () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () =>
                    Promise.resolve({
                      message: 'Test',
                      blocks: null,
                      success: true,
                    }),
                }),
              1000
            )
          )
      );

      const { result } = renderHook(() => useAIChapterChat());

      act(() => {
        result.current.sendMessage('First message');
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.sendMessage('Second message');
      });

      // Should only have messages from first call
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'API Error' }),
      });

      const { result } = renderHook(() => useAIChapterChat());

      act(() => {
        result.current.sendMessage('Test prompt');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('API Error');
      // User message should remain, loading message should be removed
      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].role).toBe('user');
    });
  });

  describe('clearChat', () => {
    it('should clear all messages and reset state', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'Test response',
            blocks: null,
            success: true,
          }),
      });

      const { result } = renderHook(() => useAIChapterChat());

      // Send a message first
      act(() => {
        result.current.sendMessage('Test prompt');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.messages.length).toBeGreaterThan(0);

      // Clear the chat
      act(() => {
        result.current.clearChat();
      });

      expect(result.current.messages).toHaveLength(0);
      expect(result.current.error).toBeNull();
      expect(result.current.inputValue).toBe('');
    });
  });

  describe('getLastGeneratedBlocks', () => {
    it('should return the last generated blocks', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'Test response',
            blocks: [
              { type: 'richText', content: 'Block 1' },
              { type: 'proTip', content: 'Block 2', title: 'Tip' },
            ],
            success: true,
          }),
      });

      const { result } = renderHook(() => useAIChapterChat());

      act(() => {
        result.current.sendMessage('Test prompt');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const blocks = result.current.getLastGeneratedBlocks();
      expect(blocks).toBeDefined();
      expect(blocks).toHaveLength(2);
      expect(blocks![0].type).toBe('richText');
    });

    it('should return null when no blocks have been generated', () => {
      const { result } = renderHook(() => useAIChapterChat());

      const blocks = result.current.getLastGeneratedBlocks();
      expect(blocks).toBeNull();
    });
  });

  describe('inputValue', () => {
    it('should allow setting input value', () => {
      const { result } = renderHook(() => useAIChapterChat());

      act(() => {
        result.current.setInputValue('New input');
      });

      expect(result.current.inputValue).toBe('New input');
    });

    it('should clear input after sending message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'Test',
            blocks: null,
            success: true,
          }),
      });

      const { result } = renderHook(() => useAIChapterChat());

      act(() => {
        result.current.setInputValue('Test message');
      });

      expect(result.current.inputValue).toBe('Test message');

      act(() => {
        result.current.sendMessage('Test message');
      });

      expect(result.current.inputValue).toBe('');
    });
  });

  describe('courseContext', () => {
    it('should initialize with courseContext option', () => {
      const courseContext = {
        title: 'React Fundamentals',
        description: 'Learn React from scratch',
        language: 'javascript',
      };

      const { result } = renderHook(() => useAIChapterChat({ courseContext }));

      expect(result.current.messages).toHaveLength(0);
      expect(result.current.isLoading).toBe(false);
    });

    it('should pass courseContext to API call', async () => {
      const courseContext = {
        title: 'Angular Basics',
        description: 'Learn Angular fundamentals',
        language: 'typescript',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'Test response',
            blocks: [{ type: 'richText', content: 'Angular content' }],
            success: true,
          }),
      });

      const { result } = renderHook(() => useAIChapterChat({ courseContext }));

      act(() => {
        result.current.sendMessage('Generate intro');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verify courseContext was passed in the API call
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/ai/generate-chapter',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('"courseContext"'),
        })
      );

      // Parse the body to verify courseContext content
      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.courseContext).toEqual(courseContext);
    });

    it('should work without courseContext (backward compatible)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'Test response',
            blocks: null,
            success: true,
          }),
      });

      const { result } = renderHook(() => useAIChapterChat());

      act(() => {
        result.current.sendMessage('Generate content');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verify API was called without courseContext
      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.courseContext).toBeUndefined();
    });
  });
});
