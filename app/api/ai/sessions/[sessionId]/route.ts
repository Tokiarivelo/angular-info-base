import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ sessionId: string }>;
}

/**
 * GET /api/ai/sessions/[sessionId]
 * Fetch a single AI chat session with all messages
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { sessionId } = await params;

    const chatSession = await prisma.aIChatSession.findFirst({
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

    return NextResponse.json({
      session: chatSession,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching AI session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session', success: false },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ai/sessions/[sessionId]
 * Delete an AI chat session and all its messages
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { sessionId } = await params;

    // Verify ownership
    const chatSession = await prisma.aIChatSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
    });

    if (!chatSession) {
      return NextResponse.json(
        { error: 'Session not found', success: false },
        { status: 404 }
      );
    }

    // Delete session (messages cascade)
    await prisma.aIChatSession.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting AI session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session', success: false },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ai/sessions/[sessionId]
 * Update session title, model, or language
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { sessionId } = await params;
    const body = await request.json();
    const { title, model, contentLanguage } = body;

    // Verify ownership
    const chatSession = await prisma.aIChatSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
    });

    if (!chatSession) {
      return NextResponse.json(
        { error: 'Session not found', success: false },
        { status: 404 }
      );
    }

    const updatedSession = await prisma.aIChatSession.update({
      where: { id: sessionId },
      data: {
        ...(title !== undefined && { title }),
        ...(model !== undefined && { model }),
        ...(contentLanguage !== undefined && { contentLanguage }),
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return NextResponse.json({
      session: updatedSession,
      success: true,
    });
  } catch (error) {
    console.error('Error updating AI session:', error);
    return NextResponse.json(
      { error: 'Failed to update session', success: false },
      { status: 500 }
    );
  }
}
