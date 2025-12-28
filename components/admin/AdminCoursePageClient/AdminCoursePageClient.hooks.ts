import { useQuery } from '@tanstack/react-query';
import { Course } from './AdminCoursePageClient.types';

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

export function useAdminCoursePage(id: string) {
  const {
    data: course,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adminCourse', id],
    queryFn: () => fetchAdminCourse(id),
  });

  return { course, isLoading, error };
}
