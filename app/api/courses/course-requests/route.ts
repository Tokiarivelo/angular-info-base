import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courseRequests = await prisma.courseRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(courseRequests);
  } catch (error) {
    console.error('Error fetching course requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course requests' },
      { status: 500 }
    );
  }
}
