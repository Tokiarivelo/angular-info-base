'use client';

import { useTransition } from 'react';
import { reviewEnrollmentRequest } from '@/lib/actions';

interface EnrollmentRequest {
  id: string;
  status: string;
  message: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  course: {
    id: string;
    title: string;
  };
}

interface EnrollmentRequestsListProps {
  requests: EnrollmentRequest[];
}

export default function EnrollmentRequestsList({
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

  return (
    <div className="space-y-8">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Pending Requests
          </h2>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white border border-gray-300 rounded-lg shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {request.course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Requested by:{' '}
                      <span className="font-medium">
                        {request.user.name || request.user.email}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                    {request.message && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                        <p className="text-sm text-gray-700">{request.message}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReview(request.id, true)}
                    disabled={isPending}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReview(request.id, false)}
                    disabled={isPending}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviewed Requests */}
      {reviewedRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Reviewed Requests
          </h2>
          <div className="space-y-3">
            {reviewedRequests.map((request) => (
              <div
                key={request.id}
                className={`border rounded-lg p-4 ${
                  request.status === 'APPROVED'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {request.course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      User: {request.user.name || request.user.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Status:{' '}
                      <span className="font-medium">{request.status}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
          No enrollment requests yet.
        </div>
      )}
    </div>
  );
}
