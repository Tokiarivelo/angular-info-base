'use client';

import { EnrollButtonProps } from './EnrollButton.types';
import { useEnrollment } from './EnrollButton.hooks';

export default function EnrollButton({
  courseId,
  isEnrolled,
}: EnrollButtonProps) {
  const { isPending, handleEnroll } = useEnrollment(courseId);

  if (isEnrolled) {
    return (
      <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
        Enrolled
      </span>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={isPending}
      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? 'Enrolling...' : 'Enroll'}
    </button>
  );
}
