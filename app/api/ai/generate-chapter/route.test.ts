/**
 * @jest-environment node
 */
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock the @google/genai module
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    chats: {
      create: jest.fn().mockReturnValue({
        sendMessage: jest.fn().mockResolvedValue({
          text: JSON.stringify({
            blocks: [
              { type: 'richText', content: '<h2>Test</h2><p>Test content</p>' },
            ],
          }),
        }),
      }),
    },
  })),
}));

// Helper to create mock NextRequest
const createMockRequest = (body: unknown): NextRequest => {
  return {
    json: async () => body,
  } as unknown as NextRequest;
};

describe('POST /api/ai/generate-chapter', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, GEMINI_API_KEY: 'test-api-key' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return 400 if prompt is missing', async () => {
    const request = createMockRequest({});

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Prompt is required');
  });

  it('should return 500 if GEMINI_API_KEY is not configured', async () => {
    delete process.env.GEMINI_API_KEY;

    const request = createMockRequest({ prompt: 'Test prompt' });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Gemini API key is not configured');
  });

  it('should return generated content successfully', async () => {
    const request = createMockRequest({
      prompt: 'Generate a chapter about Angular components',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.blocks).toBeDefined();
    expect(Array.isArray(data.blocks)).toBe(true);
  });

  it('should handle conversation history', async () => {
    const conversationHistory = [
      { role: 'user', content: 'Previous question' },
      { role: 'model', content: 'Previous answer' },
    ];

    const request = createMockRequest({
      prompt: 'Follow-up question',
      conversationHistory,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should handle custom courseContext', async () => {
    const courseContext = {
      title: 'React Fundamentals',
      description: 'Learn React from scratch with hands-on examples',
      language: 'javascript',
    };

    const request = createMockRequest({
      prompt: 'Generate introduction chapter',
      courseContext,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.blocks).toBeDefined();
  });

  it('should use default courseContext when not provided', async () => {
    const request = createMockRequest({
      prompt: 'Generate a chapter',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should handle plain text response when JSON parsing fails', async () => {
    // Reset and re-mock with plain text response
    jest.resetModules();
    jest.doMock('@google/genai', () => ({
      GoogleGenAI: jest.fn().mockImplementation(() => ({
        chats: {
          create: jest.fn().mockReturnValue({
            sendMessage: jest.fn().mockResolvedValue({
              text: 'Plain text response without JSON',
            }),
          }),
        },
      })),
    }));

    // Re-import the module with the new mock
    const { POST: POSTWithPlainText } = await import('./route');

    const request = createMockRequest({ prompt: 'Test prompt' });

    const response = await POSTWithPlainText(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Plain text response without JSON');
    expect(data.blocks).toBeNull();
  });
});
