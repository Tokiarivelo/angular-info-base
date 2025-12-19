'use client';

import { useState } from 'react';
import EnrollButton from '@/components/EnrollButton';
import RequestEnrollmentButton from '@/components/RequestEnrollmentButton';
import RequestCourseModal from '@/components/RequestCourseModal'; // Assuming RequestCourseModal is refactored
import { CoursesPageClientProps } from './CoursesPageClient.types';

export default function CoursesPageClient({
  allCourses,
  enrolledCourseIds,
  requestedCourseIds,
}: CoursesPageClientProps) {
  const [showRequestModal, setShowRequestModal] = useState(false);

  const enrolledSet = new Set(enrolledCourseIds);
  const requestedSet = new Set(requestedCourseIds);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          All Available Courses
        </h2>
        <button
          onClick={() => setShowRequestModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium"
        >
          Request New Course
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allCourses.map((course) => {
          const isEnrolled = enrolledSet.has(course.id);
          const isRequested = requestedSet.has(course.id);

          return (
            <div
              key={course.id}
              className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${
                isEnrolled ? 'border-2 border-blue-500' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">
                    {course.title}
                  </h3>
                  {isEnrolled ? (
                    <EnrollButton courseId={course.id} isEnrolled={true} />
                  ) : isRequested ? (
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded">
                      Pending
                    </span>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <EnrollButton courseId={course.id} isEnrolled={false} />
                      <RequestEnrollmentButton
                        courseId={course.id}
                        courseTitle={course.title}
                      />
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {course.description || 'No description'}
                </p>
                <div className="text-sm text-gray-500">
                  {course._count?.Chapter || course._count?.chapters || 0}{' '}
                  chapters
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <RequestCourseModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </>
  );
}
