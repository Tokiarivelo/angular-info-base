'use client';

import { useCourseRequestsList } from './CourseRequestsList.hooks';
import { CourseRequestsListProps } from './CourseRequestsList.types';
import {
  Check,
  X,
  Clock,
  HelpCircle,
  User,
  Calendar,
  FileText,
  Activity,
} from 'lucide-react';

export default function CourseRequestsList({
  requests,
}: CourseRequestsListProps) {
  const {
    isPending,
    handleReview,
    pendingRequests,
    inProgressRequests,
    reviewedRequests,
  } = useCourseRequestsList({ requests });

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="space-y-10">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Pending Review ({pendingRequests.length})
            </h2>
          </div>

          <div className="grid gap-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white dark:bg-gray-800 border-l-4 border-amber-500 rounded-r-xl shadow-sm hover:shadow-md transition-shadow dark:border-l-amber-500 border-y border-r border-gray-100 dark:border-gray-700 dark:border-y-gray-700 dark:border-r-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                          {request.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            {request.User.name || request.User.email}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(request.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-6">
                    {request.description && (
                      <div className="flex gap-3 text-sm">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300 block mb-0.5">
                            Description
                          </span>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {request.description}
                          </p>
                        </div>
                      </div>
                    )}
                    {request.reason && (
                      <div className="flex gap-3 text-sm">
                        <HelpCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300 block mb-0.5">
                            Motivation
                          </span>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {request.reason}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleReview(request.id, 'APPROVED')}
                      disabled={isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 hover:shadow-lg hover:shadow-green-900/20 transition-all disabled:opacity-50 disabled:transform-none transform hover:-translate-y-0.5"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReview(request.id, 'IN_PROGRESS')}
                      disabled={isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-900/20 transition-all disabled:opacity-50 disabled:transform-none transform hover:-translate-y-0.5"
                    >
                      <Activity className="w-4 h-4" />
                      Mark In Progress
                    </button>
                    <button
                      onClick={() => handleReview(request.id, 'REJECTED')}
                      disabled={isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-red-600 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-800 transition-all disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* In Progress Requests */}
      {inProgressRequests.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Processing ({inProgressRequests.length})
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {inProgressRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-900/30 shadow-sm rounded-xl p-5 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />

                <div className="pl-3">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">
                        {request.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {request.User.name || request.User.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700 mt-3">
                    <button
                      onClick={() => handleReview(request.id, 'APPROVED')}
                      disabled={isPending}
                      className="flex-1 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-semibold rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-50"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleReview(request.id, 'REJECTED')}
                      disabled={isPending}
                      className="px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviewed Requests */}
      {reviewedRequests.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="h-2 w-2 rounded-full bg-gray-400" />
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              History ({reviewedRequests.length})
            </h2>
          </div>

          <div className="space-y-3">
            {reviewedRequests.map((request) => (
              <div
                key={request.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                  request.status === 'APPROVED'
                    ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 opacity-70 hover:opacity-100'
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      request.status === 'APPROVED'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {request.status === 'APPROVED' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {request.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{request.User.name || request.User.email}</span>
                      <span>•</span>
                      <span>{formatDate(request.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                    request.status === 'APPROVED'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}
                >
                  {request.status}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {requests.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 opacity-50" />
          </div>
          <p className="font-medium">No course requests found.</p>
        </div>
      )}
    </div>
  );
}
