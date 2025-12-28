'use client';

import EnrollmentRequestsList from '@/components/admin/EnrollmentRequestsList';
import { useAdminEnrollmentRequestsPage } from './AdminEnrollmentRequestsPageClient.hooks';

export default function AdminEnrollmentRequestsPageClient() {
  const { requests, isLoading, error } = useAdminEnrollmentRequestsPage();

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Enrollment Requests
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
          Enrollment Requests
        </h1>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading requests</p>
        </div>
      </div>
    );
  }

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Enrollment Requests
      </h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow p-6">
          <div className="text-sm text-yellow-700 mb-1">Pending</div>
          <div className="text-3xl font-bold text-yellow-900">
            {pendingCount}
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

      <EnrollmentRequestsList requests={requests} />
    </div>
  );
}
