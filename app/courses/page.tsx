import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function CoursesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  // Get courses the user is enrolled in
  const enrollments = await prisma.courseEnrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          chapters: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  // Get all courses for browsing
  const allCourses = await prisma.course.findMany({
    include: {
      chapters: {
        orderBy: { order: 'asc' },
      },
      _count: {
        select: { chapters: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const enrolledCourseIds = new Set(
    enrollments.map((e) => e.course.id)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/checklist"
                className="text-xl font-bold text-gray-900"
              >
                Angular Checklist
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/courses"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Courses
              </Link>
              <Link
                href="/checklist"
                className="text-gray-700 hover:text-gray-900"
              >
                Checklists
              </Link>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-gray-900"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            My Courses
          </h1>

          {enrollments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-center">
                You are not enrolled in any courses yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {enrollment.course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {enrollment.course.description || 'No description'}
                    </p>
                    <div className="text-sm text-gray-500 mb-4">
                      {enrollment.course.chapters.length} chapters
                    </div>
                    <div className="space-y-2">
                      {enrollment.course.chapters.map((chapter) => (
                        <Link
                          key={chapter.id}
                          href={`/courses/chapter/${chapter.id}`}
                          className="block text-blue-600 hover:text-blue-800 hover:underline text-sm"
                        >
                          {chapter.order + 1}. {chapter.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">
            All Available Courses
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allCourses.map((course) => (
              <div
                key={course.id}
                className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${
                  enrolledCourseIds.has(course.id)
                    ? 'border-2 border-blue-500'
                    : ''
                }`}
              >
                <div className="p-6">
                  {enrolledCourseIds.has(course.id) && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                      Enrolled
                    </span>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description || 'No description'}
                  </p>
                  <div className="text-sm text-gray-500">
                    {course._count.chapters} chapters
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
