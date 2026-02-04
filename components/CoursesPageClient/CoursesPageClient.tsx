'use client';

import { useState } from 'react';
import RequestCourseModal from '@/components/RequestCourseModal'; // Assuming RequestCourseModal is refactored
import { CoursesPageClientProps } from './CoursesPageClient.types';
import CourseCard from '@/components/CourseCard/CourseCard';
import { Search, Grid, List } from 'lucide-react';

export default function CoursesPageClient({
  allCourses,
  enrolledCourseIds,
  requestedCourseIds,
}: CoursesPageClientProps) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const enrolledSet = new Set(enrolledCourseIds);
  const requestedSet = new Set(requestedCourseIds); // Set of course IDs that are pending approval?

  // Filter courses based on search
  const filteredCourses = allCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Grid className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Explore Catalog
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Discover new courses and expand your skills
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none w-full md:w-64"
              />
            </div>

            <button
              onClick={() => setShowRequestModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 text-sm font-medium transition-colors shadow-lg shadow-purple-600/20 whitespace-nowrap"
            >
              Request New Course
            </button>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              No courses found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledSet.has(course.id);
              const isRequested = requestedSet.has(course.id);

              // Normalize chapter count
              const chaptersCount =
                course._count?.Chapter ?? course._count?.chapters ?? 0;

              const nextChapter =
                course.Chapter && course.Chapter.length > 0
                  ? {
                      id: course.Chapter[0].id,
                      title: course.Chapter[0].title,
                      order: course.Chapter[0].order,
                    }
                  : undefined;

              return (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  imageUrl={course.imageUrl}
                  chaptersCount={chaptersCount}
                  isEnrolled={isEnrolled}
                  status={isRequested ? 'PENDING' : undefined}
                  nextChapter={isEnrolled ? nextChapter : undefined}
                />
              );
            })}

            {/* Quick action card for requesting a course if not found */}
            <button
              onClick={() => setShowRequestModal(true)}
              className="group flex flex-col items-center justify-center p-8 bg-purple-50 dark:bg-purple-900/10 border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-2xl hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all min-h-[300px]"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <List className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-1">
                Don&apos;t see what you need?
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-400 text-center max-w-[200px]">
                Request a new course topic and we&apos;ll consider adding it.
              </p>
            </button>
          </div>
        )}
      </div>

      <RequestCourseModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </>
  );
}
