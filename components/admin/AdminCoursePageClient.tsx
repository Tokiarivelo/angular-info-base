'use client';

import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CourseEditForm from '@/components/admin/CourseEditForm';
import ChaptersList from '@/components/admin/ChaptersList';

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  order: number;
  _count: {
    Quiz: number;
    UserChapterProgress: number;
  };
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  Chapter: Chapter[];
  _count: {
    CourseEnrollment: number;
  };
}

async function fetchAdminCourse(id: string): Promise<Course> {
  const response = await fetch(`/api/admin/courses/${id}`);

  if (response.status === 404) {
    throw new Error('NOT_FOUND');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch course');
  }

  return response.json();
}

export default function AdminCoursePageClient({ id }: { id: string }) {
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['adminCourse', id],
    queryFn: () => fetchAdminCourse(id),
  });

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

      <ChaptersList courseId={course.id} chapters={course.Chapter} />
    </div>
  );
}
