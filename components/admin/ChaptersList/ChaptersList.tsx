import { useState } from 'react';
import { Plus } from 'lucide-react';
import ChapterEditModal from '../ChapterEditModal';
import { useChaptersList } from './ChaptersList.hooks';
import { ChaptersListProps } from './ChaptersList.types';
import { createChapter, updateChapter } from '@/app/actions/chapter';

export default function ChaptersList({
  courseId,
  courseContext,
  chapters: initialChapters,
}: ChaptersListProps) {
  const { chapters, isPending, handleDeleteChapter } = useChaptersList({
    chapters: initialChapters,
  });

  const [editingChapter, setEditingChapter] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSaveChapter = async (chapterId: string | null, data: any) => {
    let result;
    if (chapterId) {
      result = await updateChapter(chapterId, data);
    } else {
      result = await createChapter(courseId, data);
    }

    if (result.success) {
      // Refresh page to show changes
      window.location.reload();
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Chapters
          </h2>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Chapter
          </button>
        </div>

        {chapters.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No chapters yet. Start building your course!
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add First Chapter
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-white dark:bg-gray-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 rounded">
                        Order {chapter.order}
                      </span>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {chapter.title}
                      </h3>
                    </div>
                    {chapter.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {chapter.description}
                      </p>
                    )}
                    <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{chapter._count?.Quiz || 0} quizzes</span>
                      <span>
                        {chapter._count?.UserChapterProgress || 0} progress
                        entries
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingChapter(chapter)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </button>
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

      {/* Edit/Create Modal */}
      {(editingChapter || isCreating) && (
        <ChapterEditModal
          chapter={editingChapter}
          courseId={courseId}
          courseContext={courseContext}
          isOpen={true}
          onClose={() => {
            setEditingChapter(null);
            setIsCreating(false);
          }}
          onSave={handleSaveChapter}
        />
      )}
    </>
  );
}
