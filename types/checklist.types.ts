import { z } from 'zod';

// Zod schema for checklist form validation
export const checklistFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
});

// TypeScript type inferred from Zod schema
export type ChecklistFormData = z.infer<typeof checklistFormSchema>;

// Checklist store state type
export interface ChecklistStoreState {
  isCreateModalOpen: boolean;
  isLoading: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  setLoading: (loading: boolean) => void;
}
