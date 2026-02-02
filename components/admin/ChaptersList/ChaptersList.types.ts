import { CourseContext } from '../AIChapterChat/AIChapterChat.types';

export interface Chapter {
  id: string;
  courseId?: string;
  title: string;
  description: string | null;
  content?: string | null;
  imageUrl?: string | null;
  livePreviewUrl?: string | null;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChaptersListProps {
  courseId: string;
  courseContext?: CourseContext;
  chapters: (Chapter & {
    _count: { Quiz: number; UserChapterProgress: number };
  })[];
}
