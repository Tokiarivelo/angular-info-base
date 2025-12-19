import { useState, useTransition } from 'react';
import { requestCourseEnrollment } from '@/lib/actions';

export function useRequestEnrollment(courseId: string) {
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
          error instanceof Error ? error.message : 'Failed to send request'
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
