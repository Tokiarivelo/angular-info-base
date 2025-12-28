import { useRouter } from 'next/navigation';
import { deleteCourse } from '@/lib/actions';
import { useDelete } from '@/components/shared/hooks';

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
