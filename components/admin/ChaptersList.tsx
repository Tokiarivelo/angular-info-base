'use client';

import { useState, useTransition } from 'react';
import { createChapter, deleteChapter } from '@/lib/actions';
import { Chapter } from '@prisma/client';

interface ChaptersListProps {
  courseId: string;
  chapters: (Chapter & {
    _count: { quizzes: number; userProgress: number };
  })[];
}

export default function ChaptersList({
  courseId,
  chapters,
}: ChaptersListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAddChapter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createChapter(courseId, formData);
        setIsAdding(false);
        e.currentTarget.reset();
      } catch (error) {
        console.error('Failed to create chapter:', error);
      }
    });
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this chapter? This will also delete all related quizzes and progress data.'
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteChapter(chapterId);
      } catch (error) {
        console.error('Failed to delete chapter:', error);
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Chapters</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isAdding ? 'Cancel' : 'Add Chapter'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddChapter} className="mb-6 p-4 border rounded-lg">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <input
                type="number"
                name="order"
                defaultValue={chapters.length}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
      )}

      {chapters.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          No chapters yet. Add your first one!
        </p>
      ) : (
        <div className="space-y-3">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      Order {chapter.order}
                    </span>
                    <h3 className="font-semibold text-gray-900">
                      {chapter.title}
                    </h3>
                  </div>
                  {chapter.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {chapter.description}
                    </p>
                  )}
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>{chapter._count.quizzes} quizzes</span>
                    <span>{chapter._count.userProgress} progress entries</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteChapter(chapter.id)}
                    disabled={isPending}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
