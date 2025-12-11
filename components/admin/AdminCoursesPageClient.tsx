'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string | null;
  _count: {
    Chapter: number;
    CourseEnrollment: number;
  };
}

async function fetchAdminCourses(): Promise<Course[]> {
  const response = await fetch('/api/admin/courses');

  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }

  return response.json();
}

export default function AdminCoursesPageClient() {
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: fetchAdminCourses,
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
          <Link
            href="/admin/courses/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Course
          </Link>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error || !courses) {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
          <Link
            href="/admin/courses/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Course
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading courses</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
        <Link
          href="/admin/courses/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No courses yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {course.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {course.description || 'No description'}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{course._count.Chapter} chapters</span>
                <span>{course._count.CourseEnrollment} enrollments</span>
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/admin/courses/${course.id}`}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700"
                >
                  Manage
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
