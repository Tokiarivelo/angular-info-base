import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let targetUserId = session.user.id;

    if (session.user.role === 'ADMIN') {
      const cookieStore = await cookies();
      const impersonatedUserId = cookieStore.get('impersonate_userId')?.value;
      if (impersonatedUserId) {
        targetUserId = impersonatedUserId;
      }
    }

    const courseRequests = await prisma.courseRequest.findMany({
      where: { userId: targetUserId },
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
