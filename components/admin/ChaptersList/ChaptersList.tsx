import { useState } from 'react';
import { Plus, Edit, Trash, FileText, HelpCircle, Eye } from 'lucide-react';
import ChapterEditModal, { Tab } from '../ChapterEditModal';
import { useChaptersList } from './ChaptersList.hooks';
import { ChaptersListProps } from './ChaptersList.types';
import { createChapter, updateChapter } from '@/app/actions/chapter';
import Image from 'next/image';

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
  const [initialTab, setInitialTab] = useState<Tab>('basic');

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
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <FileText className="w-5 h-5" />
              </span>
              Curriculum
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 ml-10">
              Manage your course chapters and content
            </p>
          </div>
          <button
            onClick={() => {
              setIsCreating(true);
              setInitialTab('basic');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Add Chapter
          </button>
        </div>

        {chapters.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No chapters yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Get started by creating your first chapter. You can add text,
              images, code blocks and quizzes.
            </p>
            <button
              onClick={() => {
                setIsCreating(true);
                setInitialTab('basic');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 inline-flex items-center gap-2 font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create First Chapter
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
              >
                {/* Image Preview */}
                <div className="aspect-video bg-gray-100 dark:bg-gray-900 relative overflow-hidden shrink-0">
                  {chapter.imageUrl ? (
                    <img
                      src={chapter.imageUrl}
                      alt={chapter.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600">
                      <FileText className="w-12 h-12 opacity-50" />
                    </div>
                  )}

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingChapter(chapter);
                        setInitialTab('basic');
                      }}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 hover:scale-110 transition-all shadow-lg"
                      title="Edit Settings"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChapter(chapter.id);
                      }}
                      disabled={isPending}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 hover:scale-110 transition-all shadow-lg disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white rounded-md">
                      Chapter {chapter.order}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 min-h-[40px]">
                    {chapter.description || 'No description provided.'}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                      <div
                        className="flex items-center gap-1.5"
                        title="Quizzes"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{chapter._count?.Quiz || 0}</span>
                      </div>
                      <div
                        className="flex items-center gap-1.5"
                        title="Progress"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{chapter._count?.UserChapterProgress || 0}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditingChapter(chapter);
                        setInitialTab('content');
                      }}
                      className="text-xs font-semibold px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      Edit Content
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Add Card */}
            <button
              onClick={() => {
                setIsCreating(true);
                setInitialTab('basic');
              }}
              className="group relative flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 flex items-center justify-center mb-4 transition-colors">
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-400" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Add New Chapter
              </span>
            </button>
          </div>
        )}
      </div>

      {(editingChapter || isCreating) && (
        <ChapterEditModal
          chapter={editingChapter}
          courseId={courseId}
          courseContext={courseContext}
          isOpen={true}
          initialTab={initialTab}
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
