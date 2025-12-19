import { Screenshot, ChapterProgress } from '@/types/chapter.types';

export interface ChapterProgressFormProps {
  chapterId: string;
  progress: ChapterProgress | null;
}
