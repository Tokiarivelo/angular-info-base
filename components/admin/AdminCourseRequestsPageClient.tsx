'use client';

import { useQuery } from '@tanstack/react-query';
import CourseRequestsList from '@/components/admin/CourseRequestsList';

interface CourseRequest {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  reason: string | null;
  status: string;
  createdAt: string;
  User: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

async function fetchCourseRequests(): Promise<CourseRequest[]> {
  const response = await fetch('/api/admin/course-requests');

  if (!response.ok) {
    throw new Error('Failed to fetch course requests');
  }

  return response.json();
}

export default function AdminCourseRequestsPageClient() {
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['adminCourseRequests'],
    queryFn: fetchCourseRequests,
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Course Requests
        </h1>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error || !requests) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Course Requests
        </h1>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading requests</p>
        </div>
      </div>
    );
  }

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;
  const inProgressCount = requests.filter(
    (r) => r.status === 'IN_PROGRESS'
  ).length;
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Course Requests
      </h1>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow p-6">
          <div className="text-sm text-yellow-700 mb-1">Pending</div>
          <div className="text-3xl font-bold text-yellow-900">
            {pendingCount}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg shadow p-6">
          <div className="text-sm text-blue-700 mb-1">In Progress</div>
          <div className="text-3xl font-bold text-blue-900">
            {inProgressCount}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg shadow p-6">
          <div className="text-sm text-green-700 mb-1">Approved</div>
          <div className="text-3xl font-bold text-green-900">
            {approvedCount}
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg shadow p-6">
          <div className="text-sm text-red-700 mb-1">Rejected</div>
          <div className="text-3xl font-bold text-red-900">{rejectedCount}</div>
        </div>
      </div>

      <CourseRequestsList requests={requests} />
    </div>
  );
}
