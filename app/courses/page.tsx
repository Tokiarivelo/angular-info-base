import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import EnrollButton from '@/components/EnrollButton';
import RequestEnrollmentButton from '@/components/RequestEnrollmentButton';
import CoursesPageClient from '@/components/CoursesPageClient';

export default async function CoursesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  // Get courses the user is enrolled in
  const enrollments = await prisma.courseEnrollment.findMany({
    where: { userId: session.user.id },
    include: {
      Course: {
        include: {
          Chapter: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  // Get enrollment requests
  const enrollmentRequests = await prisma.enrollmentRequest.findMany({
    where: { userId: session.user.id },
    include: {
      Course: true,
    },
  });

  // Get course requests
  const courseRequests = await prisma.courseRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  // Get all courses for browsing
  const allCourses = await prisma.course.findMany({
    include: {
      Chapter: {
        orderBy: { order: 'asc' },
      },
      _count: {
        select: { Chapter: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const enrolledCourseIds = new Set(enrollments.map((e) => e.Course.id));
  const requestedCourseIds = new Set(
    enrollmentRequests.map((r) => r.Course.id)
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
          {/* Pending Enrollment Requests */}
          {enrollmentRequests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Pending Enrollment Requests
              </h2>
              <div className="space-y-3">
                {enrollmentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {request.Course.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Status:{' '}
                          <span className="font-medium text-yellow-700">
                            {request.status}
                          </span>
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        Requested{' '}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Course Requests */}
          {courseRequests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                My Course Requests
              </h2>
              <div className="space-y-3">
                {courseRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`border rounded-lg p-4 ${
                      request.status === 'APPROVED'
                        ? 'bg-green-50 border-green-200'
                        : request.status === 'REJECTED'
                          ? 'bg-red-50 border-red-200'
                          : request.status === 'IN_PROGRESS'
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {request.title}
                        </h3>
                        {request.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {request.description}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-2">
                          Status:{' '}
                          <span className="font-medium">{request.status}</span>
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 ml-4">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                      {enrollment.Course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {enrollment.Course.description || 'No description'}
                    </p>
                    <div className="text-sm text-gray-500 mb-4">
                      {enrollment.Course.Chapter.length} chapters
                    </div>
                    <div className="space-y-2">
                      {enrollment.Course.Chapter.map((chapter) => (
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

          <CoursesPageClient
            allCourses={allCourses}
            enrolledCourseIds={Array.from(enrolledCourseIds)}
            requestedCourseIds={Array.from(requestedCourseIds)}
          />
        </div>
      </div>
    </div>
  );
}
