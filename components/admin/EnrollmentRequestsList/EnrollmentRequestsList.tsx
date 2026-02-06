'use client';

import { useEnrollmentRequestsList } from './EnrollmentRequestsList.hooks';
import { EnrollmentRequestsListProps } from './EnrollmentRequestsList.types';
import { useTranslations } from 'next-intl';
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  BookOpen,
  Calendar,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

export default function EnrollmentRequestsList({
  requests,
}: EnrollmentRequestsListProps) {
  const t = useTranslations('admin');
  const { isPending, handleReview, pendingRequests, reviewedRequests } =
    useEnrollmentRequestsList({ requests });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-10">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
            {t('pendingRequests')}
            <span className="ml-2 text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full">
              {pendingRequests.length}
            </span>
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="group bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <Clock className="w-20 h-20 text-gray-50 dark:text-gray-800 absolute -top-4 -right-4 rotate-12" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                      <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-800/30">
                      {t('pending')}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1 mb-1">
                    {request.Course.title}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {request.User.name || request.User.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(request.createdAt)}
                    </div>
                  </div>

                  {request.message && (
                    <div className="mb-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300 relative">
                      <MessageSquare className="w-4 h-4 absolute top-4 left-4 text-gray-400" />
                      <p className="pl-6 italic">
                        &quot;{request.message}&quot;
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => handleReview(request.id, false)}
                      disabled={isPending}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      {t('reject')}
                    </button>
                    <button
                      onClick={() => handleReview(request.id, true)}
                      disabled={isPending}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {t('approve')}
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
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></span>
            {t('reviewedRequests')}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {t('course')}
                    </th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {t('requestedBy')}
                    </th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {t('date')}
                    </th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {t('status')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {reviewedRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {request.Course.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {request.User.name || request.User.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                            request.status === 'APPROVED'
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30'
                              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800/30'
                          }`}
                        >
                          {request.status === 'APPROVED' ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          {request.status === 'APPROVED'
                            ? t('approved')
                            : t('rejected')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {requests.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('noRequests')}
          </h3>
        </div>
      )}
    </div>
  );
}
