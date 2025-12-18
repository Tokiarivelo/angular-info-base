import { create } from 'zustand';
import { ChecklistStoreState } from '@/types/checklist.types';

export const useChecklistStore = create<ChecklistStoreState>((set) => ({
  isCreateModalOpen: false,
  isLoading: false,
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
