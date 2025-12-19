import { BaseEntity } from './shared.types';
import { Checklist } from './checklist.types';
import { Quiz } from './quiz.types';

export interface Screenshot extends BaseEntity {
  url: string;
  publicId: string | null;
  caption: string | null;
  userId?: string;
  progressId?: string | null;
}

export interface ChapterProgress extends BaseEntity {
  userId: string;
  chapterId: string;
  repositoryUrl: string | null;
  websiteUrl: string | null;
  completed: boolean;
  screenshots: Screenshot[];
}

export interface ChapterChecklistItem extends BaseEntity {
  title: string;
}

export interface ChapterChecklist extends BaseEntity {
  title: string;
  description: string | null;
  ChecklistItem: ChapterChecklistItem[];
}

export interface Chapter extends BaseEntity {
  title: string;
  description: string | null;
  content: string | null;
  livePreviewUrl: string | null;
  order: number;
  courseId: string;
  Course: {
    id: string;
    title: string;
  };
  Checklist: Array<ChapterChecklist>;
  Quiz: Array<Quiz>;
}

export interface ChapterData {
  chapter: Chapter;
  progress: ChapterProgress | null;
  allChapters: Array<{
    id: string;
    title: string;
    order: number;
  }>;
}
