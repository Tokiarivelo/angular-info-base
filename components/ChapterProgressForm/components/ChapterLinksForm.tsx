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
    <>
      <div>
        <label
          htmlFor="repositoryUrl"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          GitHub Repository URL
        </label>
        <input
          type="url"
          id="repositoryUrl"
          placeholder="https://github.com/username/repository"
          className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.repositoryUrl ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('repositoryUrl')}
        />
        {errors.repositoryUrl && (
          <p className="mt-1 text-sm text-red-600">
            {errors.repositoryUrl.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="websiteUrl"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Deployed Website URL
        </label>
        <input
          type="url"
          id="websiteUrl"
          placeholder="https://your-project.vercel.app"
          className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.websiteUrl ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('websiteUrl')}
        />
        {errors.websiteUrl && (
          <p className="mt-1 text-sm text-red-600">
            {errors.websiteUrl.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Saving...' : 'Save Links'}
      </button>
    </>
  );
}
