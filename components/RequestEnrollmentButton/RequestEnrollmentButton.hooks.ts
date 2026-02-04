import { useState, useTransition } from 'react';
import { requestCourseEnrollment } from '@/lib/actions';

export function useRequestEnrollment(
  courseId: string,
  options: { errorFallbackMessage: string }
) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequest = () => {
    setError('');
    startTransition(async () => {
      try {
        await requestCourseEnrollment(courseId, message);
        setShowForm(false);
        setMessage('');
      } catch (error) {
        console.error('Failed to request enrollment:', error);
        setError(
          error instanceof Error ? error.message : options.errorFallbackMessage
        );
      }
    });
  };

  const openForm = () => setShowForm(true);
  const closeForm = () => {
    setShowForm(false);
    setMessage('');
    setError('');
  };

  return {
    isPending,
    showForm,
    message,
    setMessage,
    error,
    handleRequest,
    openForm,
    closeForm,
  };
}
