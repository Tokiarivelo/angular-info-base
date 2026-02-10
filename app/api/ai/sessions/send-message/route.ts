import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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

/**
 * POST /api/ai/sessions/send-message
 * Send a message within a session and get AI response
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sessionId, prompt, model, contentLanguage, courseContext } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required', success: false },
        { status: 400 }
      );
    }

    if (!(await isAIConfigured())) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured', success: false },
        { status: 500 }
      );
    }

    let chatSession;
    let existingMessages: any[] = [];

    // If sessionId provided, fetch or create session
    if (sessionId) {
      chatSession = await prisma.aIChatSession.findFirst({
        where: {
          id: sessionId,
          userId: session.user.id,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!chatSession) {
        return NextResponse.json(
          { error: 'Session not found', success: false },
          { status: 404 }
        );
      }

      existingMessages = chatSession.messages;
    } else {
      // Create a new session
      chatSession = await prisma.aIChatSession.create({
        data: {
          userId: session.user.id,
          title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
          model: model || 'gemini-2.0-flash',
          contentLanguage: contentLanguage || 'en',
        },
        include: {
          messages: true,
        },
      });
    }

    // Save user message
    const userMessage = await prisma.aIChatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: 'user',
        content: prompt,
      },
    });

    // Build conversation history for context
    const conversationHistory: ChatMessage[] = existingMessages.map((msg) => ({
      role: msg.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: msg.content }],
    }));

    // Use provided course context or default
    const context: CourseContext = courseContext || getDefaultCourseContext();
    if (contentLanguage) {
      context.contentLanguage = contentLanguage;
    }

    // Generate prompts based on context
    const systemPrompt = generateChapterSystemPrompt(context);
    const ackMessage = generateChapterAckMessage(context);

    // Create chat session with AI and send message
    const aiChat = await createChatSession(
      systemPrompt,
      ackMessage,
      conversationHistory,
      model || chatSession.model
    );
    const text = await sendChatMessage(aiChat, prompt);

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

    // Save assistant message
    const assistantMessage = await prisma.aIChatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: 'assistant',
        content: text,
        blocks: result.blocks
          ? JSON.parse(JSON.stringify(result.blocks))
          : null,
        chapterTitle: result.chapterTitle,
        chapterDescription: result.chapterDescription,
        imagePrompt: result.imagePrompt,
      },
    });

    // Update session title if it's a new session (first message)
    if (existingMessages.length === 0) {
      const title =
        result.chapterTitle ||
        prompt.slice(0, 50) + (prompt.length > 50 ? '...' : '');
      await prisma.aIChatSession.update({
        where: { id: chatSession.id },
        data: { title },
      });
    }

    // Update session's updatedAt
    await prisma.aIChatSession.update({
      where: { id: chatSession.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      sessionId: chatSession.id,
      userMessageId: userMessage.id,
      message: {
        id: assistantMessage.id,
        sessionId: chatSession.id,
        role: 'assistant',
        content: text,
        blocks: result.blocks,
        chapterTitle: result.chapterTitle,
        chapterDescription: result.chapterDescription,
        imagePrompt: result.imagePrompt,
        createdAt: assistantMessage.createdAt,
      },
      blocks: result.blocks,
      chapterTitle: result.chapterTitle,
      chapterDescription: result.chapterDescription,
      imagePrompt: result.imagePrompt,
      success: true,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      {
        error: 'Failed to send message',
        details: String(error),
        success: false,
      },
      { status: 500 }
    );
  }
}
