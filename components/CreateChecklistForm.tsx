'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useChecklistStore } from '@/lib/stores/useChecklistStore';
import {
  checklistFormSchema,
  ChecklistFormData,
} from '@/types/checklist.types';
import { createChecklist } from '@/lib/actions';

export default function CreateChecklistForm() {
  const {
    isCreateModalOpen,
    isLoading,
    openCreateModal,
    closeCreateModal,
    setLoading,
  } = useChecklistStore();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChecklistFormData>({
    resolver: zodResolver(checklistFormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  async function onSubmit(data: ChecklistFormData) {
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

      reset(); // Reset form fields
      closeCreateModal();
    } catch (error) {
      console.error('Error creating checklist:', error);
      alert('Failed to create checklist');
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    reset(); // Reset form when canceling
    closeCreateModal();
  }

  if (!isCreateModalOpen) {
    return (
      <button
        onClick={openCreateModal}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        New Checklist
      </button>
    );
  }

  return (
    <div className="bg-white shadow-xl bg-opacity-95 backdrop-blur-sm border border-indigo-100 sm:rounded-2xl p-6 w-full max-w-lg relative">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Create New Checklist
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            autoFocus
            {...register('title')}
            className={`block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all ${
              errors.title ? 'border-red-500' : ''
            }`}
            placeholder="e.g., Angular Fundamentals"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description (optional)
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description')}
            className={`block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all ${
              errors.description ? 'border-red-500' : ''
            }`}
            placeholder="What is this checklist about?"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create Checklist'}
          </button>
        </div>
      </form>
    </div>
  );
}
