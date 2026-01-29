'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
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
      <div>
        <div className="mb-6">
          <Link
            href="/admin/courses"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to Courses
          </Link>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
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
      <div>
        <div className="mb-6">
          <Link
            href="/admin/courses"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to Courses
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading course</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/courses"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Back to Courses
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {course.title}
        </h1>
        <div className="text-gray-600">
          {course._count.CourseEnrollment} enrollments
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <CourseEditForm course={course} />
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link
              href={`/courses/chapter/${course.Chapter[0]?.id || ''}`}
              className={`block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 ${
                !course.Chapter[0] ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              Preview First Chapter
            </Link>
          </div>
        </div>
      </div>

      <ChaptersList
        courseId={course.id}
        courseContext={{
          title: course.title,
          description: course.description || undefined,
          language: 'typescript', // Default to TypeScript for this platform
        }}
        chapters={course.Chapter}
      />
    </div>
  );
}
