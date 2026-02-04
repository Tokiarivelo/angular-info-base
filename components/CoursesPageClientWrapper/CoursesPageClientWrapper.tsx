'use client';

import Link from 'next/link';
import Header from '@/components/shared/Header/Header';
import CoursesPageClient from '@/components/CoursesPageClient';
import CourseCard from '@/components/CourseCard/CourseCard';
import { useCoursesData } from './CoursesPageClientWrapper.hooks';
import { User } from 'next-auth';
import { BookOpen, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CoursesPageClientWrapper({ user }: { user: User }) {
  const t = useTranslations('coursesDashboard');
  const {
    enrollments,
    enrollmentRequests,
    courseRequests,
    allCourses,
    isLoading,
  } = useCoursesData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
        <Header user={user} variant="user" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {t('loadingDashboard')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const enrolledCourseIds = enrollments
    ? enrollments.map((e) => e.Course.id)
    : [];
  const requestedCourseIds = enrollmentRequests
    ? enrollmentRequests.map((r) => r.Course.id)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <Header user={user} variant="user" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 space-y-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">
              {t('welcomeBack', {
                name: user.name?.split(' ')[0] || t('studentFallback'),
              })}
            </h1>
            <p className="text-blue-100 max-w-xl text-lg">
              {t('activeCourses', { count: enrollments?.length || 0 })}
            </p>
          </div>
        </div>

        {/* Pending Enrollment Requests */}
        {enrollmentRequests && enrollmentRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              {t('pendingApprovals')}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {enrollmentRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-yellow-100 dark:border-yellow-900/30 shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {request.Course.title}
                  </h3>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                      {t('pendingReview')}
                    </span>
                    <span>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Course Requests */}
        {courseRequests && courseRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              {t('myCourseRequests')}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courseRequests.map((request) => (
                <div
                  key={request.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl p-5 border shadow-sm relative overflow-hidden ${
                    request.status === 'APPROVED'
                      ? 'border-green-200 dark:border-green-900/30'
                      : request.status === 'REJECTED'
                        ? 'border-red-200 dark:border-red-900/30'
                        : 'border-blue-200 dark:border-blue-900/30'
                  }`}
                >
                  <div
                    className={`absolute top-0 left-0 w-1 h-full ${
                      request.status === 'APPROVED'
                        ? 'bg-green-500'
                        : request.status === 'REJECTED'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                    }`}
                  ></div>

                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {request.title}
                  </h3>
                  {request.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                      {request.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center text-sm mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        request.status === 'APPROVED'
                          ? 'bg-green-100 text-green-700'
                          : request.status === 'REJECTED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {t(`status.${request.status.toLowerCase()}`)}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Courses */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              {t('myCourses')}
            </h2>
          </div>

          {enrollments && enrollments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('noCoursesTitle')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                {t('noCoursesDescription')}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {enrollments?.map((enrollment) => (
                <CourseCard
                  key={enrollment.id}
                  id={enrollment.Course.id}
                  title={enrollment.Course.title}
                  description={enrollment.Course.description}
                  imageUrl={enrollment.Course.imageUrl}
                  chaptersCount={enrollment.Course.Chapter?.length || 0}
                  isEnrolled={true}
                  nextChapter={
                    enrollment.Course.Chapter?.[0]
                      ? {
                          id: enrollment.Course.Chapter[0].id,
                          title: enrollment.Course.Chapter[0].title,
                          order: enrollment.Course.Chapter[0].order,
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* All Courses Catalog */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <CoursesPageClient
            allCourses={allCourses || []}
            enrolledCourseIds={enrolledCourseIds}
            requestedCourseIds={requestedCourseIds}
          />
        </div>
      </div>
    </div>
  );
}
