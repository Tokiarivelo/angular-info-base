'use client';

import { Screenshot } from '@/types/chapter.types';
import { useTranslations } from 'next-intl';

interface ChapterScreenshotUploadProps {
  screenshots: Screenshot[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  isUploading: boolean;
  uploadError: string | null;
  isPending: boolean;
}

export default function ChapterScreenshotUpload({
  screenshots,
  onUpload,
  onRemove,
  isUploading,
  uploadError,
  isPending,
}: ChapterScreenshotUploadProps) {
  const t = useTranslations('chapterProgress.screenshots');
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-l-4 border-purple-500 p-6 rounded-r-lg shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">📸</span>
        </div>
        <label className="text-lg font-bold text-gray-900 dark:text-white">
          {t('title')}
        </label>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label
            htmlFor="screenshot"
            className="block w-full cursor-pointer border-2 border-dashed border-purple-300 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-500 rounded-lg p-6 text-center bg-white dark:bg-gray-800 transition-all hover:shadow-md"
          >
            <div className="space-y-2">
              <div className="text-4xl">🖼️</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('uploadPrompt')}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('fileTypes')}
              </div>
            </div>
            <input
              type="file"
              id="screenshot"
              accept="image/*"
              onChange={onUpload}
              disabled={isUploading || isPending}
              className="sr-only"
            />
          </label>
          {isUploading && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
              <div className="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
              {t('uploading')}
            </div>
          )}
          {uploadError && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
              ❌ {uploadError}
            </p>
          )}
        </div>

        {/* Screenshot Gallery */}
        {screenshots.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('uploaded', { count: screenshots.length })}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {screenshots.map((screenshot) => (
                <div
                  key={screenshot.id}
                  className="relative group rounded-lg overflow-hidden border-2 border-purple-200 dark:border-purple-800 hover:border-purple-500 dark:hover:border-purple-500 shadow-sm hover:shadow-lg transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={screenshot.url}
                    alt={screenshot.caption || `Screenshot ${screenshot.id}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <button
                    type="button"
                    onClick={() => onRemove(screenshot.id)}
                    disabled={isPending}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 hover:scale-110 disabled:opacity-50 shadow-lg"
                    aria-label={t('removeLabel')}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
