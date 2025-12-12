import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const requests = await prisma.courseRequest.findMany({
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching course requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course requests' },
      { status: 500 }
    );
  }
}
