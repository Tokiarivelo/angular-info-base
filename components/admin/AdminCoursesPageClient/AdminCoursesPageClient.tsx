'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAdminCoursesPage } from './AdminCoursesPageClient.hooks';
import {
  Plus,
  BookOpen,
  Users,
  MoreVertical,
  Search,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function AdminCoursesPageClient() {
  const { courses, isLoading, error } = useAdminCoursesPage();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center animate-pulse">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !courses) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Failed to load courses
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Something went wrong while fetching the data.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <BookOpen className="w-6 h-6" />
            </span>
            Manage Courses
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Create, edit and manage platform curriculum.
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="group flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-blue-600/20 transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Create Course
        </Link>
      </div>

      {/* Course Grid */}
      {courses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No courses yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
            Get started by creating your first course content for your students.
          </p>
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create First Course
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 flex flex-col overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 relative overflow-hidden">
                {course.imageUrl ? (
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <>
                    <div className="absolute top-0 right-0 p-20 bg-blue-500/5 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <BookOpen className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                    </div>
                  </>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm line-clamp-2 min-h-[40px]">
                  {course.description ||
                    'No description provided for this course.'}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-2.5 py-1.5 rounded-lg">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{course._count.Chapter} Chapters</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-2.5 py-1.5 rounded-lg">
                    <Users className="w-3.5 h-3.5" />
                    <span>{course._count.CourseEnrollment} Students</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700">
                <Link
                  href={`/admin/courses/${course.id}`}
                  className="block w-full py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:border-blue-600 transition-all shadow-sm"
                >
                  Manage Content
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
