'use client';

import { useTranslations } from 'next-intl';
import EnrollmentRequestsList from '@/components/admin/EnrollmentRequestsList';
import { useAdminEnrollmentRequestsPage } from './AdminEnrollmentRequestsPageClient.hooks';
import { CheckCircle2, XCircle, Clock, BarChart3 } from 'lucide-react';

export default function AdminEnrollmentRequestsPageClient() {
  const t = useTranslations('admin');
  const { requests, isLoading, error } = useAdminEnrollmentRequestsPage();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"
            ></div>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !requests) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('errorLoadingRequests')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {(error as Error)?.message || 'Unknown error'}
        </p>
      </div>
    );
  }

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('enrollmentRequestsTitle')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('enrollmentRequestsDesc')}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          label={t('pending')}
          value={pendingCount}
          icon={
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          }
          gradient="from-amber-50 to-white dark:from-amber-900/10 dark:to-gray-800"
          border="border-amber-100 dark:border-amber-800/30"
          iconBg="bg-amber-100 dark:bg-amber-900/30"
        />
        <StatCard
          label={t('approved')}
          value={approvedCount}
          icon={
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          }
          gradient="from-emerald-50 to-white dark:from-emerald-900/10 dark:to-gray-800"
          border="border-emerald-100 dark:border-emerald-800/30"
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatCard
          label={t('rejected')}
          value={rejectedCount}
          icon={<XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
          gradient="from-red-50 to-white dark:from-red-900/10 dark:to-gray-800"
          border="border-red-100 dark:border-red-800/30"
          iconBg="bg-red-100 dark:bg-red-900/30"
        />
      </div>

      <EnrollmentRequestsList requests={requests} />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  gradient,
  border,
  iconBg,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  border: string;
  iconBg: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl border ${border} shadow-sm transition-all hover:shadow-md duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center transition-transform hover:scale-110 duration-300`}
        >
          {icon}
        </div>
        <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          {value}
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
        {label}
      </p>
    </div>
  );
}
