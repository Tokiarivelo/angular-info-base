import { EditorBlock } from '@/components/admin/ChapterRichContentEditor/ChapterRichContentEditor.types';

/**
 * AI Chat Session represents a saved conversation with the AI
 */
export interface AIChatSession {
  id: string;
  userId: string;
  courseId?: string | null;
  chapterId?: string | null;
  title: string;
  model: string;
  contentLanguage: 'en' | 'fr';
  createdAt: Date | string;
  updatedAt: Date | string;
  messages: AIChatMessageData[];
}

/**
 * AI Chat Message data structure
 */
export interface AIChatMessageData {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  blocks?: EditorBlock[] | null;
  chapterTitle?: string | null;
  chapterDescription?: string | null;
  imagePrompt?: string | null;
  createdAt: Date | string;
  isLoading?: boolean; // Client-side only
}

/**
 * Create session request payload
 */
export interface CreateSessionPayload {
  courseId?: string;
  chapterId?: string;
  title?: string;
  model?: string;
  contentLanguage?: 'en' | 'fr';
}

/**
 * Send message request payload
 */
export interface SendMessagePayload {
  sessionId: string;
  prompt: string;
  model?: string;
}

/**
 * API Response types
 */
export interface SessionListResponse {
  sessions: AIChatSession[];
  success: boolean;
  error?: string;
}

export interface SessionResponse {
  session: AIChatSession;
  success: boolean;
  error?: string;
}

export interface SendMessageResponse {
  message: AIChatMessageData;
  blocks?: EditorBlock[] | null;
  chapterTitle?: string | null;
  chapterDescription?: string | null;
  imagePrompt?: string | null;
  success: boolean;
  error?: string;
}
