'use client';

import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  FileText,
  LayoutList,
} from 'lucide-react';
import { useAdminCourseRequestsPage } from './AdminCourseRequestsPageClient.hooks';
import CourseRequestsList from '@/components/admin/CourseRequestsList';

export default function AdminCourseRequestsPageClient() {
  const { requests, isLoading, error } = useAdminCourseRequestsPage();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl"
            ></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
      </div>
    );
  }

  if (error || !requests) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Error Loading Requests
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Unable to fetch course requests at this time.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium"
        >
          Retry
        </button>
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
          <LayoutList className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Course Requests
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Review and manage new course proposals.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatusCard
          label="Pending"
          count={pendingCount}
          icon={<Clock className="w-5 h-5" />}
          color="bg-amber-100 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 border-amber-200 dark:border-amber-800"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <StatusCard
          label="In Progress"
          count={inProgressCount}
          icon={<MoreHorizontal className="w-5 h-5" />}
          color="bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatusCard
          label="Approved"
          count={approvedCount}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="bg-green-100 dark:bg-green-900/20 text-green-900 dark:text-green-100 border-green-200 dark:border-green-800"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatusCard
          label="Rejected"
          count={rejectedCount}
          icon={<XCircle className="w-5 h-5" />}
          color="bg-red-100 dark:bg-red-900/20 text-red-900 dark:text-red-100 border-red-200 dark:border-red-800"
          iconColor="text-red-600 dark:text-red-400"
        />
      </div>

      {/* Main Content List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            All Requests
          </h2>
        </div>
        <div className="p-1">
          <CourseRequestsList requests={requests} />
        </div>
      </div>
    </div>
  );
}

function StatusCard({
  label,
  count,
  icon,
  color,
  iconColor,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  iconColor: string;
}) {
  return (
    <div
      className={`p-5 rounded-2xl border ${color} transition-transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold opacity-80">{label}</span>
        <div
          className={`p-1.5 rounded-lg bg-white/50 dark:bg-black/20 ${iconColor}`}
        >
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold tracking-tight">{count}</div>
    </div>
  );
}
