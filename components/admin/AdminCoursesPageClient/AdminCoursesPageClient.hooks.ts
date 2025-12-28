import { useQuery } from '@tanstack/react-query';
import { Course } from './AdminCoursesPageClient.types';

async function fetchAdminCourses(): Promise<Course[]> {
  const response = await fetch('/api/admin/courses');

  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }

  return response.json();
}

export function useAdminCoursesPage() {
  const {
    data: courses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: fetchAdminCourses,
  });

  return { courses, isLoading, error };
}
