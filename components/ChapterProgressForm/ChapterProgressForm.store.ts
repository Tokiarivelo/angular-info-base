import { create } from 'zustand';
import { Screenshot } from '@/types/chapter.types';

interface ChapterProgressState {
  screenshots: Screenshot[];
  isUploading: boolean;
  uploadError: string | null;
  setScreenshots: (screenshots: Screenshot[]) => void;
  addScreenshot: (screenshot: Screenshot) => void;
  removeScreenshot: (screenshotId: string) => void;
  setIsUploading: (isUploading: boolean) => void;
  setUploadError: (error: string | null) => void;
  reset: () => void;
}

export const useChapterProgressStore = create<ChapterProgressState>((set) => ({
  screenshots: [],
  isUploading: false,
  uploadError: null,
  setScreenshots: (screenshots) => set({ screenshots }),
  addScreenshot: (screenshot) =>
    set((state) => ({ screenshots: [...state.screenshots, screenshot] })),
  removeScreenshot: (screenshotId) =>
    set((state) => ({
      screenshots: state.screenshots.filter((s) => s.id !== screenshotId),
    })),
  setIsUploading: (isUploading) => set({ isUploading }),
  setUploadError: (uploadError) => set({ uploadError }),
  reset: () => set({ screenshots: [], isUploading: false, uploadError: null }),
}));
