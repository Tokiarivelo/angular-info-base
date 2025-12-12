import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [
      coursesCount,
      chaptersCount,
      usersCount,
      enrollmentsCount,
      pendingEnrollmentRequests,
      pendingCourseRequests,
    ] = await Promise.all([
      prisma.course.count(),
      prisma.chapter.count(),
      prisma.user.count(),
      prisma.courseEnrollment.count(),
      prisma.enrollmentRequest.count({ where: { status: 'PENDING' } }),
      prisma.courseRequest.count({ where: { status: 'PENDING' } }),
    ]);

    return NextResponse.json({
      coursesCount,
      chaptersCount,
      usersCount,
      enrollmentsCount,
      pendingEnrollmentRequests,
      pendingCourseRequests,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
