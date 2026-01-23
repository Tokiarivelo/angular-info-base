'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ChapterProgressFormData } from '../ChapterProgressForm.schema';

interface ChapterLinksFormProps {
  register: UseFormRegister<ChapterProgressFormData>;
  errors: FieldErrors<ChapterProgressFormData>;
  isPending: boolean;
}

export default function ChapterLinksForm({
  register,
  errors,
  isPending,
}: ChapterLinksFormProps) {
  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-l-4 border-blue-500 p-6 rounded-r-lg shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">🔗</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Project Links
        </h3>
      </div>

      <div>
        <label
          htmlFor="repositoryUrl"
          className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
        >
          📦 GitHub Repository URL
        </label>
        <input
          type="url"
          id="repositoryUrl"
          placeholder="https://github.com/username/repository"
          className={`w-full px-4 py-3 border-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            errors.repositoryUrl
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          }`}
          {...register('repositoryUrl')}
        />
        {errors.repositoryUrl && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
            {errors.repositoryUrl.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="websiteUrl"
          className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
        >
          🌐 Deployed Website URL
        </label>
        <input
          type="url"
          id="websiteUrl"
          placeholder="https://your-project.vercel.app"
          className={`w-full px-4 py-3 border-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            errors.websiteUrl
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          }`}
          {...register('websiteUrl')}
        />
        {errors.websiteUrl && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
            {errors.websiteUrl.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {isPending ? '💾 Saving...' : '✅ Save Links'}
      </button>
    </div>
  );
}
