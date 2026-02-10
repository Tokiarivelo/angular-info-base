import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/ai/sessions
 * Fetch all AI chat sessions for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const chapterId = searchParams.get('chapterId');

    const where: any = {
      userId: session.user.id,
    };

    if (courseId) {
      where.courseId = courseId;
    }

    if (chapterId) {
      where.chapterId = chapterId;
    }

    const sessions = await prisma.aIChatSession.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1, // Just get first message for preview
        },
      },
    });

    return NextResponse.json({
      sessions,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching AI sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions', success: false },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/sessions
 * Create a new AI chat session
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
    const { courseId, chapterId, title, model, contentLanguage } = body;

    const newSession = await prisma.aIChatSession.create({
      data: {
        userId: session.user.id,
        courseId: courseId || null,
        chapterId: chapterId || null,
        title: title || 'New Chat',
        model: model || 'gemini-2.0-flash',
        contentLanguage: contentLanguage || 'en',
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json({
      session: newSession,
      success: true,
    });
  } catch (error) {
    console.error('Error creating AI session:', error);
    return NextResponse.json(
      { error: 'Failed to create session', success: false },
      { status: 500 }
    );
  }
}
