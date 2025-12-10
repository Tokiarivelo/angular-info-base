import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/courses');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/admin"
                className="text-xl font-bold text-gray-900 mr-8"
              >
                Admin Panel
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/admin/courses"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Courses
                </Link>
                <Link
                  href="/admin/enrollment-requests"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Enrollment Requests
                </Link>
                <Link
                  href="/admin/course-requests"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Course Requests
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/courses"
                className="text-gray-700 hover:text-gray-900"
              >
                User View
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
        <div className="px-4 py-6 sm:px-0">{children}</div>
      </div>
    </div>
  );
}
