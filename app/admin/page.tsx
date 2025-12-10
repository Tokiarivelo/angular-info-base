import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminPage() {
  const coursesCount = await prisma.course.count();
  const chaptersCount = await prisma.chapter.count();
  const usersCount = await prisma.user.count();
  const enrollmentsCount = await prisma.courseEnrollment.count();

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

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/courses"
            className="block p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-gray-900">Manage Courses</div>
            <div className="text-sm text-gray-600">
              Create, edit, and delete courses
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
