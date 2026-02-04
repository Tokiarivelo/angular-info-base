'use client';

import Link from 'next/link';
import { BookOpen, PlayCircle, Clock } from 'lucide-react';
import { CourseCardProps } from './CourseCard.types';
import EnrollButton from '@/components/EnrollButton';
import RequestEnrollmentButton from '@/components/RequestEnrollmentButton';
import { useTranslations } from 'next-intl';

export default function CourseCard({
  id,
  title,
  description,
  imageUrl,
  chaptersCount = 0,
  isEnrolled,
  status,
  nextChapter,
  children, // Slot for custom actions if needed
}: React.PropsWithChildren<CourseCardProps>) {
  const t = useTranslations('courseCard');
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Image Section */}
      <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-900 shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800/50">
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600" />
          </div>
        )}

        {/* Status Badge Overlay */}
        {isEnrolled && (
          <div className="absolute top-3 right-3">
            <span className="bg-green-100/90 backdrop-blur-sm text-green-700 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm border border-green-200">
              {t('status.enrolled')}
            </span>
          </div>
        )}
        {status === 'PENDING' && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-100/90 backdrop-blur-sm text-yellow-700 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm border border-yellow-200">
              {t('status.pendingApproval')}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 min-h-[40px] flex-1">
          {description || t('noDescription')}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('lessons', { count: chaptersCount })}</span>
          </div>
          {/* Default duration placeholder if we don't have it */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{t('selfPaced')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto">
          {isEnrolled ? (
            <Link
              href={`/courses/chapter/${nextChapter?.id || ''}`}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 ${!nextChapter ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <PlayCircle className="w-4 h-4" />
              {nextChapter ? t('actions.continue') : t('actions.start')}
            </Link>
          ) : status === 'PENDING' ? (
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-medium rounded-xl cursor-not-allowed"
            >
              {t('actions.requestPending')}
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              {/* Default Enroll Action - can be overridden by children */}
              {children ? (
                children
              ) : (
                <>
                  <EnrollButton courseId={id} isEnrolled={false} />
                  <RequestEnrollmentButton courseId={id} courseTitle={title} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
