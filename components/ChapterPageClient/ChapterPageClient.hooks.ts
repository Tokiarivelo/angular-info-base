import { useQuery } from '@tanstack/react-query';
import { ChapterData } from '@/types/chapter.types';

async function fetchChapterData(id: string): Promise<ChapterData> {
  const response = await fetch(`/api/courses/chapters/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch chapter data');
  }

  return response.json();
}

export function useChapterData(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['chapter', id],
    queryFn: () => fetchChapterData(id),
  });

  return {
    data,
    isLoading,
    error,
  };
}
