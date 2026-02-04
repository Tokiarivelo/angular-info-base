import { NextRequest, NextResponse } from 'next/server';
import {
  createChatSession,
  sendChatMessage,
  extractJsonFromResponse,
  isAIConfigured,
  generateChapterSystemPrompt,
  generateChapterAckMessage,
  getDefaultCourseContext,
  parseChapterGenerationResponse,
  type CourseContext,
  type ChatMessage,
} from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const {
      prompt,
      conversationHistory = [],
      courseContext,
    } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!(await isAIConfigured())) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Use provided course context or default
    const context: CourseContext = courseContext || getDefaultCourseContext();

    // Generate prompts based on context
    const systemPrompt = generateChapterSystemPrompt(context);
    const ackMessage = generateChapterAckMessage(context);

    // Build conversation history
    const history: ChatMessage[] = conversationHistory.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: msg.content }],
      })
    );

    // Create chat session and send message
    const chat = await createChatSession(systemPrompt, ackMessage, history);
    const text = await sendChatMessage(chat, prompt);

    // Parse the response
    const parsed = extractJsonFromResponse<any>(text);

    let result = {
      chapterTitle: null as string | null,
      chapterDescription: null as string | null,
      imagePrompt: null as string | null,
      blocks: null as any[] | null,
    };

    if (parsed) {
      result = parseChapterGenerationResponse(parsed);
    }

    return NextResponse.json({
      message: text,
      blocks: result.blocks,
      chapterTitle: result.chapterTitle,
      chapterDescription: result.chapterDescription,
      imagePrompt: result.imagePrompt,
      success: true,
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: String(error) },
      { status: 500 }
    );
  }
}
