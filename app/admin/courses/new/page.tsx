'use client';

import CreateCourseForm from '@/components/admin/CreateCourseForm';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function NewCoursePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Link
            href="/admin"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Admin
          </Link>
          <span>/</span>
          <Link
            href="/admin/courses"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Courses
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">New</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-blue-600 dark:text-blue-500" />
          Create New Course
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Start building your new course. Use our AI assistant to draft the
          content or start from scratch.
        </p>
      </div>

      <CreateCourseForm />
    </div>
  );
}
