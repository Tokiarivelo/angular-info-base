// AI Client and utilities
export {
  getAIClient,
  createChatSession,
  sendChatMessage,
  extractJsonFromResponse,
  createErrorResponse,
  isAIConfigured,
  DEFAULT_MODEL,
  AVAILABLE_MODELS,
  listAvailableModels,
  type ChatMessage,
} from './client';

// Chapter generation prompts
export {
  generateChapterSystemPrompt,
  generateChapterAckMessage,
  getDefaultCourseContext,
  parseChapterGenerationResponse,
  type CourseContext,
  type ChapterGenerationResult,
} from './prompts/chapter';

// Block action prompts
export {
  REGENERATE_SYSTEM_PROMPT,
  IMPROVE_SYSTEM_PROMPT,
  REGENERATE_ACK,
  IMPROVE_ACK,
  generateRegeneratePrompt,
  generateImprovePrompt,
  parseRegeneratedBlock,
  createFallbackBlock,
  type BlockInput,
} from './prompts/block';

// Image generation prompts
export {
  IMAGE_PROMPT_SYSTEM,
  IMAGE_PROMPT_ACK,
  IMAGEN_CONFIG,
  POLLINATIONS_CONFIG,
  buildImagePromptContext,
  generateImagePromptRequest,
  type ImagePromptInput,
} from './prompts/image';

// Session types
export type {
  AIChatSession,
  AIChatMessageData,
  CreateSessionPayload,
  SendMessagePayload,
  SessionListResponse,
  SessionResponse,
  SendMessageResponse,
} from './session.types';
