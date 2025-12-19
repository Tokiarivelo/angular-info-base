import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useChecklistStore } from '@/lib/stores';
import { createChecklist } from '@/lib/actions';
import {
  createChecklistSchema,
  CreateChecklistFormData,
} from './CreateChecklistForm.types';

/**
 * Custom hook for managing checklist creation form logic
 */
export function useCreateChecklistForm() {
  const queryClient = useQueryClient();
  const { isLoading, setLoading, closeCreateModal } = useChecklistStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateChecklistFormData>({
    resolver: zodResolver(createChecklistSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  async function onSubmit(data: CreateChecklistFormData) {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.description) {
        formData.append('description', data.description);
      }

      await createChecklist(formData);

      // Invalidate and refetch checklists to show the new one
      queryClient.invalidateQueries({ queryKey: ['checklists'] });

      reset();
      closeCreateModal();
    } catch (error) {
      console.error('Error creating checklist:', error);
      alert('Failed to create checklist');
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    reset();
    closeCreateModal();
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    handleCancel,
    errors,
    isLoading,
  };
}
