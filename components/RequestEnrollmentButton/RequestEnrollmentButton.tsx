'use client';

import { RequestEnrollmentButtonProps } from './RequestEnrollmentButton.types';
import { useRequestEnrollment } from './RequestEnrollmentButton.hooks';

export default function RequestEnrollmentButton({
  courseId,
  courseTitle,
}: RequestEnrollmentButtonProps) {
  const {
    isPending,
    showForm,
    message,
    setMessage,
    error,
    handleRequest,
    openForm,
    closeForm,
  } = useRequestEnrollment(courseId);

  if (showForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Request Enrollment
          </h3>
          <p className="text-gray-600 mb-4">
            Course: <strong>{courseTitle}</strong>
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell the admin why you want to enroll in this course..."
            />
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="flex space-x-3">
            <button
              onClick={handleRequest}
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Sending...' : 'Send Request'}
            </button>
            <button
              onClick={closeForm}
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={openForm}
      className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
    >
      Request Enrollment
    </button>
  );
}
