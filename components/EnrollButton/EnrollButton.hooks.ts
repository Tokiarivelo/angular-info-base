import { useTransition } from 'react';
import { enrollInCourse } from '@/lib/actions';

export function useEnrollment(courseId: string) {
  const [isPending, startTransition] = useTransition();

  const handleEnroll = () => {
    startTransition(async () => {
      try {
        await enrollInCourse(courseId);
      } catch (error) {
        console.error('Failed to enroll:', error);
      }
    });
  };

  return {
    isPending,
    handleEnroll,
  };
}
