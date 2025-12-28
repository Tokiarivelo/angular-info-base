'use client';

import { useAddChapterForm } from './AddChapterForm.hooks';
import { AddChapterFormProps } from './AddChapterForm.types';

export default function AddChapterForm({ courseId }: AddChapterFormProps) {
  const { register, handleSubmit, errors, isPending } =
    useAddChapterForm(courseId);

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('title')}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('description')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order
          </label>
          <input
            type="number"
            className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.order ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('order', { valueAsNumber: true })}
          />
          {errors.order && (
            <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Creating...' : 'Create Chapter'}
        </button>
      </div>
    </form>
  );
}
