import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const enrollmentRequests = await prisma.enrollmentRequest.findMany({
      where: { userId: session.user.id },
      include: {
        Course: true,
      },
    });

    return NextResponse.json(enrollmentRequests);
  } catch (error) {
    console.error('Error fetching enrollment requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollment requests' },
      { status: 500 }
    );
  }
}
