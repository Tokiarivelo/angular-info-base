'use client';

import Link from 'next/link';
import { User } from 'next-auth';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  user?: User; // Make user optional to handle loading states or non-authenticated views cleanly if needed, though mostly required here
  variant?: 'admin' | 'user';
}

export default function Header({ user, variant = 'user' }: HeaderProps) {
  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav className="bg-white dark:bg-gray-900 dark:border-b dark:border-gray-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {variant === 'admin' ? (
              <>
                <Link
                  href="/admin"
                  className="text-xl font-bold text-gray-900 dark:text-white mr-8"
                >
                  Admin Panel
                </Link>
                <div className="flex space-x-4">
                  <Link
                    href="/admin/courses"
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Courses
                  </Link>
                  <Link
                    href="/admin/enrollment-requests"
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Enrollment Requests
                  </Link>
                  <Link
                    href="/admin/course-requests"
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Course Requests
                  </Link>
                </div>
              </>
            ) : (
              <Link
                href="/checklist"
                className="text-xl font-bold text-gray-900 dark:text-white"
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
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  User View
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Profile
                </Link>
                <ThemeToggle />
              </>
            ) : (
              // User View Right Side
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/courses"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Courses
                </Link>
                <Link
                  href="/checklist"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Checklists
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Profile
                </Link>
                <ThemeToggle />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
