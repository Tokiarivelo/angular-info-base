'use client';

import { useTransition } from 'react';
import { reviewCourseRequest } from '@/lib/actions';

interface CourseRequest {
  id: string;
  title: string;
  description: string | null;
  reason: string | null;
  status: string;
  createdAt: Date;
  User: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface CourseRequestsListProps {
  requests: CourseRequest[];
}

export default function CourseRequestsList({
  requests,
}: CourseRequestsListProps) {
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
  const inProgressRequests = requests.filter(
    (r) => r.status === 'IN_PROGRESS'
  );
  const reviewedRequests = requests.filter(
    (r) => r.status === 'APPROVED' || r.status === 'REJECTED'
  );

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
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {request.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Requested by:{' '}
                    <span className="font-medium">
                      {request.User.name || request.User.email}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>

                {request.description && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Description:
                    </h4>
                    <p className="text-sm text-gray-600">{request.description}</p>
                  </div>
                )}

                {request.reason && (
                  <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Reason:
                    </h4>
                    <p className="text-sm text-gray-700">{request.reason}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReview(request.id, 'APPROVED')}
                    disabled={isPending}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReview(request.id, 'IN_PROGRESS')}
                    disabled={isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() => handleReview(request.id, 'REJECTED')}
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

      {/* In Progress Requests */}
      {inProgressRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">In Progress</h2>
          <div className="space-y-3">
            {inProgressRequests.map((request) => (
              <div
                key={request.id}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {request.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      User: {request.User.name || request.User.email}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReview(request.id, 'APPROVED')}
                      disabled={isPending}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleReview(request.id, 'REJECTED')}
                      disabled={isPending}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
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
                      {request.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      User: {request.User.name || request.User.email}
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
          No course requests yet.
        </div>
      )}
    </div>
  );
}
