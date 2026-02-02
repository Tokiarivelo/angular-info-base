'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  BookOpen,
  Users,
  PlayCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import CourseEditForm from '@/components/admin/CourseEditForm';
import ChaptersList from '@/components/admin/ChaptersList';
import { useAdminCoursePage } from './AdminCoursePageClient.hooks';
import { AdminCoursePageClientProps } from './AdminCoursePageClient.types';

export default function AdminCoursePageClient({
  id,
}: AdminCoursePageClientProps) {
  const { course, isLoading, error } = useAdminCoursePage(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === 'NOT_FOUND') {
      notFound();
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-red-100 dark:border-red-900/30">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Course
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            We encountered an issue while loading the course data.
          </p>
          <Link
            href="/admin/courses"
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Header with Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/admin/courses"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Courses
          </Link>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {course.imageUrl && (
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700/50 px-2.5 py-1 rounded-full">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">
                    {course._count.CourseEnrollment}
                  </span>{' '}
                  enrollments
                </div>
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700/50 px-2.5 py-1 rounded-full">
                  <BookOpen className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">
                    {course.Chapter ? course.Chapter.length : 0}
                  </span>{' '}
                  chapters
                </div>
                <Link
                  href={`/courses/chapter/${course.Chapter[0]?.id || ''}`}
                  className={`flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline ${
                    !course.Chapter[0] ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <PlayCircle className="w-4 h-4" />
                  Preview Course
                </Link>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/courses/chapter/${course.Chapter[0]?.id || ''}`}
                className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  !course.Chapter[0] ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                Preview
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Chapters */}
          <div className="lg:col-span-2 space-y-8">
            <ChaptersList
              courseId={course.id}
              courseContext={{
                title: course.title,
                description: course.description || undefined,
                language: 'typescript', // Default
              }}
              chapters={course.Chapter}
            />
          </div>

          {/* Sidebar: Course Details Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6">
              <div className="p-1">
                <CourseEditForm course={course} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
