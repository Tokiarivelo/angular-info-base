'use client';

import Link from 'next/link';
import { User } from 'next-auth';

interface HeaderProps {
  user?: User; // Make user optional to handle loading states or non-authenticated views cleanly if needed, though mostly required here
  variant?: 'admin' | 'user';
}

export default function Header({ user, variant = 'user' }: HeaderProps) {
  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {variant === 'admin' ? (
              <>
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
              </>
            ) : (
              <Link
                href="/checklist"
                className="text-xl font-bold text-gray-900"
              >
                Angular Checklist
              </Link>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {variant === 'admin' ? (
              // Admin View Right Side
              <>
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
              </>
            ) : (
              // User View Right Side
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/courses"
                  className="text-gray-700 hover:text-gray-900"
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
