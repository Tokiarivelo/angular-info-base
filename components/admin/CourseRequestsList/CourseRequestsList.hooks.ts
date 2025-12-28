import { useTransition } from 'react';
import { reviewCourseRequest } from '@/lib/actions';
import { CourseRequestsListProps } from './CourseRequestsList.types';

export function useCourseRequestsList({ requests }: CourseRequestsListProps) {
  const [isPending, startTransition] = useTransition();

  const handleReview = (
    requestId: string,
    status: 'APPROVED' | 'REJECTED' | 'IN_PROGRESS'
  ) => {
    startTransition(async () => {
      try {
        await reviewCourseRequest(requestId, status);
      } catch (error) {
        console.error('Failed to review request:', error);
      }
    });
  };

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const inProgressRequests = requests.filter((r) => r.status === 'IN_PROGRESS');
  const reviewedRequests = requests.filter(
    (r) => r.status === 'APPROVED' || r.status === 'REJECTED'
  );

  return {
    isPending,
    handleReview,
    pendingRequests,
    inProgressRequests,
    reviewedRequests,
  };
}
