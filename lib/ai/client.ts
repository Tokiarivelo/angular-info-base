import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini AI client - automatically reads GEMINI_API_KEY from env
let aiInstance: GoogleGenAI | null = null;

/**
 * Get the singleton Gemini AI client instance
 */
export function getAIClient(): GoogleGenAI {
  if (!aiInstance) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not configured');
    }
    aiInstance = new GoogleGenAI({});
  }
  return aiInstance;
}

/**
 * Default model for AI operations
 */
export const DEFAULT_MODEL = 'gemini-2.5-flash';

/**
 * Chat message format for Gemini API
 */
export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

/**
 * Create a chat session with the AI
 */
export function createChatSession(
  systemPrompt: string,
  systemAck: string,
  conversationHistory: ChatMessage[] = [],
  model: string = DEFAULT_MODEL
) {
  const ai = getAIClient();

  const history: ChatMessage[] = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: systemAck }] },
    ...conversationHistory,
  ];

  return ai.chats.create({
    model,
    history,
  });
}

/**
 * Send a message to a chat session and get the response text
 */
export async function sendChatMessage(
  chat: ReturnType<typeof createChatSession>,
  message: string
): Promise<string> {
  const response = await chat.sendMessage({ message });
  return response.text ?? '';
}

/**
 * Extract JSON from a response that might be wrapped in markdown code blocks
 */
export function extractJsonFromResponse<T>(text: string): T | null {
  try {
    // Try to find JSON in markdown code blocks
    const jsonCodeBlock = /```json\s*([\s\S]*?)\s*```/;
    const genericCodeBlock = /```\s*([\s\S]*?)\s*```/;

    let jsonString = text;

    const jsonMatch = text.match(jsonCodeBlock);
    if (jsonMatch?.[1]) {
      jsonString = jsonMatch[1];
    } else {
      const genericMatch = text.match(genericCodeBlock);
      if (genericMatch?.[1]) {
        jsonString = genericMatch[1];
      }
    }

    return JSON.parse(jsonString.trim()) as T;
  } catch {
    return null;
  }
}

/**
 * Create an error response for API routes
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  details?: string
) {
  return {
    error: message,
    ...(details && { details }),
  };
}

/**
 * Check if the AI client is configured
 */
export function isAIConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}
