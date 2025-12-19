import { create } from 'zustand';

// Course-specific store for managing course-related state

interface CourseStoreState {
  isRequestModalOpen: boolean;
  isLoading: boolean;
  openRequestModal: () => void;
  closeRequestModal: () => void;
  setLoading: (loading: boolean) => void;
}

export const useCourseStore = create<CourseStoreState>((set) => ({
  isRequestModalOpen: false,
  isLoading: false,
  openRequestModal: () => set({ isRequestModalOpen: true }),
  closeRequestModal: () => set({ isRequestModalOpen: false }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
