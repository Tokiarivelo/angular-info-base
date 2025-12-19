import { create } from 'zustand';

// Generic modal store for managing modal states across the application

interface ModalState {
  modals: Record<string, boolean>;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;
  isModalOpen: (modalId: string) => boolean;
}

export const useModalStore = create<ModalState>((set, get) => ({
  modals: {},

  openModal: (modalId: string) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: true },
    })),

  closeModal: (modalId: string) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: false },
    })),

  toggleModal: (modalId: string) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: !state.modals[modalId] },
    })),

  isModalOpen: (modalId: string) => get().modals[modalId] || false,
}));
