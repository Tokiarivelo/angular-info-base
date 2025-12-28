import { useEffect, useTransition } from 'react';
import { deleteChapter } from '@/lib/actions';
import { useAdminStore } from '../store/admin.store';
import { ChaptersListProps } from './ChaptersList.types';

export function useChaptersList({
  chapters: initialChapters,
}: Pick<ChaptersListProps, 'chapters'>) {
  const { chapters, setChapters, isAddingChapter, toggleAddingChapter } =
    useAdminStore();
  const [isPending, startTransition] = useTransition();

  // Sync props to store
  useEffect(() => {
    setChapters(initialChapters);
  }, [initialChapters, setChapters]);

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

  return {
    chapters,
    isAddingChapter,
    toggleAddingChapter,
    isPending,
    handleDeleteChapter,
  };
}
