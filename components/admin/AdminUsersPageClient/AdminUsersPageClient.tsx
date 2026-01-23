'use client';

import { useAdminUsers } from './AdminUsersPageClient.hooks';
import Link from 'next/link';

export default function AdminUsersPageClient() {
  const { users, isLoading, error, handleImpersonate, isImpersonating } =
    useAdminUsers();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (error || !users) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading users</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        <Link
          href="/admin"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.image ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.image}
                          alt=""
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 font-medium text-sm">
                            {user.name?.[0] || user.email?.[0] || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name || 'No Name'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 flex space-x-4">
                    <span>{user._count.CourseEnrollment} enrollments</span>
                    <span>{user._count.Checklist} checklists</span>
                    <span>{user._count.QuizSubmission} quizzes</span>
                    <span>
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div>
                  {user.role !== 'ADMIN' && (
                    <button
                      onClick={() => handleImpersonate(user.id)}
                      disabled={isImpersonating}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isImpersonating ? 'Connecting...' : 'Watch as User'}
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
