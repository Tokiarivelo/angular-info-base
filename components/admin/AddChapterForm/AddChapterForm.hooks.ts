import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createChapter } from '@/lib/actions';
import { useAdminStore } from '../store/admin.store';
import {
  createChapterSchema,
  CreateChapterFormData,
} from './AddChapterForm.types';

export function useAddChapterForm(courseId: string) {
  const { setAddingChapter } = useAdminStore();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateChapterFormData>({
    resolver: zodResolver(createChapterSchema),
    defaultValues: {
      title: '',
      description: '',
      order: 0,
    },
  });

  const onSubmit = async (data: CreateChapterFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('order', data.order.toString());

    startTransition(async () => {
      try {
        await createChapter(courseId, formData);
        setAddingChapter(false);
        reset();
      } catch (error) {
        console.error('Failed to create chapter:', error);
      }
    });
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isPending,
  };
}
