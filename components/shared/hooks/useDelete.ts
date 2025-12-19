import { useState } from 'react';

/**
 * Generic hook for handling delete operations with confirmation
 */
export function useDelete<T = string>(
  deleteFn: (id: T) => Promise<void>,
  confirmMessage = 'Are you sure you want to delete this item?'
) {
  const [deletingId, setDeletingId] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (
    id: T,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    if (!confirm(confirmMessage)) {
      return;
    }

    setDeletingId(id);
    setError(null);

    try {
      await deleteFn(id);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete item';
      setError(errorMessage);
      console.error('Delete error:', err);
      if (onError) {
        onError(err as Error);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const isDeleting = (id: T) => deletingId === id;
  const clearError = () => setError(null);

  return {
    deletingId,
    error,
    handleDelete,
    isDeleting,
    clearError,
  };
}
