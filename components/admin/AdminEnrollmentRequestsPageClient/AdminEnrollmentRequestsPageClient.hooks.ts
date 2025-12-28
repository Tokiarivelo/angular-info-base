import { useQuery } from '@tanstack/react-query';
import { EnrollmentRequest } from './AdminEnrollmentRequestsPageClient.types';

async function fetchEnrollmentRequests(): Promise<EnrollmentRequest[]> {
  const response = await fetch('/api/admin/enrollment-requests');

  if (!response.ok) {
    throw new Error('Failed to fetch enrollment requests');
  }

  return response.json();
}

export function useAdminEnrollmentRequestsPage() {
  const {
    data: requests,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adminEnrollmentRequests'],
    queryFn: fetchEnrollmentRequests,
  });

  return { requests, isLoading, error };
}
