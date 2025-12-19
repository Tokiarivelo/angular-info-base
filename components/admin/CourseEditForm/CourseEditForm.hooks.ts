import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  courseEditSchema,
  CourseEditFormData,
  Course,
} from '@/types/course.types';
import { updateCourse, deleteCourse } from '@/lib/actions';
import { useFormSubmit } from '@/components/shared/hooks';
import { useDelete } from '@/components/shared/hooks';

/**
 * Custom hook for managing course edit form logic
 */
export function useCourseEditForm(course: Course) {
  const router = useRouter();
  const { isPending, error, handleSubmit: handleFormSubmit } = useFormSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseEditFormData>({
    resolver: zodResolver(courseEditSchema),
    defaultValues: {
      title: course.title,
      description: course.description || '',
    },
  });

  const onSubmit = async (data: CourseEditFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) {
      formData.append('description', data.description);
    }

    await handleFormSubmit(async () => {
      await updateCourse(course.id, formData);
    });
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isPending,
    error,
  };
}

/**
 * Custom hook for handling course deletion
 */
export function useCourseDelete(courseId: string) {
  const router = useRouter();

  const { handleDelete, isDeleting, error } = useDelete<string>(
    async (id: string) => {
      await deleteCourse(id);
    },
    'Are you sure you want to delete this course? This will also delete all chapters and related data.'
  );

  const handleCourseDelete = async () => {
    await handleDelete(courseId, () => {
      router.push('/admin/courses');
    });
  };

  return {
    handleCourseDelete,
    isDeleting: isDeleting(courseId),
    error,
  };
}
