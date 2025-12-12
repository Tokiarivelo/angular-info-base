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

    const { id } = await params;

    const checklist = await prisma.checklist.findUnique({
      where: { id },
      include: {
        ChecklistItem: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!checklist) {
      return NextResponse.json(
        { error: 'Checklist not found' },
        { status: 404 }
      );
    }

    if (checklist.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Transform ChecklistItem to items for consistency
    return NextResponse.json({
      ...checklist,
      items: checklist.ChecklistItem,
    });
  } catch (error) {
    console.error('Error fetching checklist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch checklist' },
      { status: 500 }
    );
  }
}
