import { GoogleGenAI } from '@google/genai';
import { getSetting } from '@/lib/settings';

// Initialize the Gemini AI client - reads GEMINI_API_KEY from settings
let aiInstance: GoogleGenAI | null = null;

/**
 * Get the singleton Gemini AI client instance
 */
export async function getAIClient(): Promise<GoogleGenAI> {
  if (!aiInstance) {
    const apiKey = await getSetting('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured');
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

/**
 * Default model for AI operations
 */
export const DEFAULT_MODEL = 'gemini-2.0-flash';

/**
 * Available models to switch between
 */
export const AVAILABLE_MODELS = [
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Fast)' },
  { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite (Cheaper)' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Stable)' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Powerful)' },
];

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
export async function createChatSession(
  systemPrompt: string,
  systemAck: string,
  conversationHistory: ChatMessage[] = [],
  model: string = DEFAULT_MODEL
) {
  const ai = await getAIClient();

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
  chat: Awaited<ReturnType<typeof createChatSession>>,
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
export async function isAIConfigured(): Promise<boolean> {
  const key = await getSetting('GEMINI_API_KEY');
  return !!key;
}

/**
 * List available models from the API
 */
export async function listAvailableModels() {
  try {
    const ai = await getAIClient();
    const response = await ai.models.list();
    // @ts-ignore - The types might be slightly off in the beta SDK, and sometimes it returns 'pageInternal'
    const rawModels = response.models || (response as any).pageInternal || [];

    // console.log('Raw models from API:', JSON.stringify(rawModels, null, 2));

    const models = rawModels
      .filter((model: any) => {
        // Check both supportedGenerationMethods and supportedActions (from valid API response)
        const methods =
          model.supportedGenerationMethods || model.supportedActions || [];
        const hasGenerateContent = methods.includes('generateContent');
        const isGemini = model.name.toLowerCase().includes('gemini');
        return hasGenerateContent && isGemini;
      })
      .map((model: any) => {
        // ID usually comes as "models/gemini-pro", strip the prefix if needed
        const id = model.name.replace('models/', '');
        return {
          id: id,
          name: model.displayName || id,
        };
      })
      .sort((a: any, b: any) => b.id.localeCompare(a.id));

    if (models.length === 0) {
      console.warn('No models found after filtering, using fallback list.');
      return AVAILABLE_MODELS;
    }

    return models;
  } catch (error) {
    console.error('Failed to list models:', error);
    return AVAILABLE_MODELS; // Fallback to hardcoded list
  }
}
