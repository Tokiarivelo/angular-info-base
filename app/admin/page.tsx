import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminPage() {
  const coursesCount = await prisma.course.count();
  const chaptersCount = await prisma.chapter.count();
  const usersCount = await prisma.user.count();
  const enrollmentsCount = await prisma.courseEnrollment.count();
  const pendingEnrollmentRequests = await prisma.enrollmentRequest.count({
    where: { status: 'PENDING' },
  });
  const pendingCourseRequests = await prisma.courseRequest.count({
    where: { status: 'PENDING' },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Admin Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Courses</div>
          <div className="text-3xl font-bold text-gray-900">{coursesCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Chapters</div>
          <div className="text-3xl font-bold text-gray-900">
            {chaptersCount}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Users</div>
          <div className="text-3xl font-bold text-gray-900">{usersCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Enrollments</div>
          <div className="text-3xl font-bold text-gray-900">
            {enrollmentsCount}
          </div>
        </div>
      </div>

      {/* Pending Requests Alert */}
      {(pendingEnrollmentRequests > 0 || pendingCourseRequests > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-yellow-900 mb-2">
            ⚠️ Pending Requests
          </h2>
          <div className="space-y-2">
            {pendingEnrollmentRequests > 0 && (
              <p className="text-yellow-800">
                <Link
                  href="/admin/enrollment-requests"
                  className="font-medium hover:underline"
                >
                  {pendingEnrollmentRequests} enrollment request
                  {pendingEnrollmentRequests !== 1 ? 's' : ''} waiting for review
                </Link>
              </p>
            )}
            {pendingCourseRequests > 0 && (
              <p className="text-yellow-800">
                <Link
                  href="/admin/course-requests"
                  className="font-medium hover:underline"
                >
                  {pendingCourseRequests} course request
                  {pendingCourseRequests !== 1 ? 's' : ''} waiting for review
                </Link>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/courses"
            className="block p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-gray-900">Manage Courses</div>
            <div className="text-sm text-gray-600">
              Create, edit, and delete courses
            </div>
          </Link>
          <Link
            href="/admin/enrollment-requests"
            className="block p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-gray-900">
              Enrollment Requests
              {pendingEnrollmentRequests > 0 && (
                <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  {pendingEnrollmentRequests}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Review enrollment requests
            </div>
          </Link>
          <Link
            href="/admin/course-requests"
            className="block p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-gray-900">
              Course Requests
              {pendingCourseRequests > 0 && (
                <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  {pendingCourseRequests}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Review new course requests
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
