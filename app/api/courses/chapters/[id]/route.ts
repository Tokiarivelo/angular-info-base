import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: chapterId } = await params;

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        Course: true,
        Checklist: {
          include: {
            ChecklistItem: true,
          },
        },
        Quiz: {
          include: {
            QuizQuestion: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    // Get user's progress for this chapter
    const progress = await prisma.userChapterProgress.findUnique({
      where: {
        userId_chapterId: {
          userId: session.user.id,
          chapterId: chapterId,
        },
      },
      include: {
        Screenshot: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Get all chapters in the course for navigation
    const allChapters = await prisma.chapter.findMany({
      where: { courseId: chapter.courseId },
      orderBy: { order: 'asc' },
      select: { id: true, title: true, order: true },
    });

    // Transform Screenshot to screenshots for consistency
    return NextResponse.json({ 
      chapter, 
      progress: progress ? {
        ...progress,
        screenshots: progress.Screenshot,
      } : null, 
      allChapters 
    });
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapter' },
      { status: 500 }
    );
  }
}
