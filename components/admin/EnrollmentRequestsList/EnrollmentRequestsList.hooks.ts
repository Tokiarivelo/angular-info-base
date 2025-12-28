import { useTransition } from 'react';
import { reviewEnrollmentRequest } from '@/lib/actions';
import { EnrollmentRequestsListProps } from './EnrollmentRequestsList.types';

export function useEnrollmentRequestsList({
  requests,
}: EnrollmentRequestsListProps) {
  const [isPending, startTransition] = useTransition();

  const handleReview = (requestId: string, approved: boolean) => {
    startTransition(async () => {
      try {
        await reviewEnrollmentRequest(requestId, approved);
      } catch (error) {
        console.error('Failed to review request:', error);
      }
    });
  };

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const reviewedRequests = requests.filter((r) => r.status !== 'PENDING');

  return { isPending, handleReview, pendingRequests, reviewedRequests };
}
