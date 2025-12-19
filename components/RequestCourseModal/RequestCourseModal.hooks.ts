import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  courseRequestSchema,
  CourseRequestFormData,
} from '@/types/course.types';
import { requestNewCourse } from '@/lib/actions';
import { useFormSubmit } from '@/components/shared/hooks';

/**
 * Custom hook for managing course request form logic
 */
export function useRequestCourseForm(onClose: () => void) {
  const {
    isPending,
    error,
    handleSubmit: handleFormSubmit,
    clearError,
  } = useFormSubmit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseRequestFormData>({
    resolver: zodResolver(courseRequestSchema),
    defaultValues: {
      title: '',
      description: '',
      reason: '',
    },
  });

  const onSubmit = async (data: CourseRequestFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) {
      formData.append('description', data.description);
    }
    if (data.reason) {
      formData.append('reason', data.reason);
    }

    await handleFormSubmit(
      async () => {
        await requestNewCourse(formData);
      },
      () => {
        reset();
        onClose();
      }
    );
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isPending,
    error,
    clearError,
  };
}
