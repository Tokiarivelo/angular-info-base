'use client';

import Link from 'next/link';
import { useAdminPage } from './AdminPageClient.hooks';

export default function AdminPageClient() {
  const { stats, isLoading, error } = useAdminPage();

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Courses</div>
          <div className="text-3xl font-bold text-gray-900">
            {stats.coursesCount}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Chapters</div>
          <div className="text-3xl font-bold text-gray-900">
            {stats.chaptersCount}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Users</div>
          <div className="text-3xl font-bold text-gray-900">
            {stats.usersCount}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Enrollments</div>
          <div className="text-3xl font-bold text-gray-900">
            {stats.enrollmentsCount}
          </div>
        </div>
      </div>

      {/* Pending Requests Alert */}
      {(stats.pendingEnrollmentRequests > 0 ||
        stats.pendingCourseRequests > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-yellow-900 mb-2">
            ⚠️ Pending Requests
          </h2>
          <div className="space-y-2">
            {stats.pendingEnrollmentRequests > 0 && (
              <p className="text-yellow-800">
                <Link
                  href="/admin/enrollment-requests"
                  className="font-medium hover:underline"
                >
                  {stats.pendingEnrollmentRequests} enrollment request
                  {stats.pendingEnrollmentRequests !== 1 ? 's' : ''} waiting for
                  review
                </Link>
              </p>
            )}
            {stats.pendingCourseRequests > 0 && (
              <p className="text-yellow-800">
                <Link
                  href="/admin/course-requests"
                  className="font-medium hover:underline"
                >
                  {stats.pendingCourseRequests} course request
                  {stats.pendingCourseRequests !== 1 ? 's' : ''} waiting for
                  review
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
              {stats.pendingEnrollmentRequests > 0 && (
                <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  {stats.pendingEnrollmentRequests}
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
              {stats.pendingCourseRequests > 0 && (
                <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  {stats.pendingCourseRequests}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Review new course requests
            </div>
          </Link>
          <Link
            href="/admin/users"
            className="block p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-gray-900">Users Management</div>
            <div className="text-sm text-gray-600">
              View users and impersonate view
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
