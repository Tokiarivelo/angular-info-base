'use client';

import AddChapterForm from '../AddChapterForm';
import { useChaptersList } from './ChaptersList.hooks';
import { ChaptersListProps } from './ChaptersList.types';

export default function ChaptersList({
  courseId,
  chapters: initialChapters,
}: ChaptersListProps) {
  const {
    chapters,
    isAddingChapter,
    toggleAddingChapter,
    isPending,
    handleDeleteChapter,
  } = useChaptersList({ chapters: initialChapters });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Chapters</h2>
        <button
          onClick={toggleAddingChapter}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isAddingChapter ? 'Cancel' : 'Add Chapter'}
        </button>
      </div>

      {isAddingChapter && <AddChapterForm courseId={courseId} />}

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
                    <span>{chapter._count?.Quiz || 0} quizzes</span>
                    <span>
                      {chapter._count?.UserChapterProgress || 0} progress
                      entries
                    </span>
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
