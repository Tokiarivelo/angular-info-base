import { create } from 'zustand';

interface Chapter {
  id: string;
  courseId?: string;
  title: string;
  description: string | null;
  content?: string | null;
  imageUrl?: string | null;
  livePreviewUrl?: string | null;
  order: number;
  _count?: { Quiz: number; UserChapterProgress: number };
}

interface AdminState {
  chapters: Chapter[];
  isAddingChapter: boolean;
  setChapters: (chapters: Chapter[]) => void;
  addChapter: (chapter: Chapter) => void;
  removeChapter: (chapterId: string) => void;
  toggleAddingChapter: () => void;
  setAddingChapter: (isAdding: boolean) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  chapters: [],
  isAddingChapter: false,
  setChapters: (chapters) => set({ chapters }),
  addChapter: (chapter) =>
    set((state) => ({ chapters: [...state.chapters, chapter] })),
  removeChapter: (chapterId) =>
    set((state) => ({
      chapters: state.chapters.filter((c) => c.id !== chapterId),
    })),
  toggleAddingChapter: () =>
    set((state) => ({ isAddingChapter: !state.isAddingChapter })),
  setAddingChapter: (isAdding) => set({ isAddingChapter: isAdding }),
}));
