import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const checklists = await prisma.checklist.findMany({
      where: { ownerId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        ChecklistItem: true,
      },
    });

    // Transform ChecklistItem to items for consistency
    const transformedChecklists = checklists.map((checklist) => ({
      ...checklist,
      items: checklist.ChecklistItem,
    }));

    return NextResponse.json(transformedChecklists);
  } catch (error) {
    console.error('Error fetching checklists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch checklists' },
      { status: 500 }
    );
  }
}
