import { useQuery } from '@tanstack/react-query';
import { CourseRequest } from './AdminCourseRequestsPageClient.types';

async function fetchCourseRequests(): Promise<CourseRequest[]> {
  const response = await fetch('/api/admin/course-requests');

  if (!response.ok) {
    throw new Error('Failed to fetch course requests');
  }

  return response.json();
}

export function useAdminCourseRequestsPage() {
  const {
    data: requests,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adminCourseRequests'],
    queryFn: fetchCourseRequests,
  });

  return { requests, isLoading, error };
}
