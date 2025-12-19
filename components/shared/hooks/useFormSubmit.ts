import { useState, useTransition } from 'react';

/**
 * Generic hook for handling form submissions with loading and error states
 */
export function useFormSubmit<T = unknown>() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    submitFn: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void
  ): Promise<T | undefined> => {
    setError(null);

    return new Promise<T | undefined>((resolve) => {
      startTransition(async () => {
        try {
          const result = await submitFn();
          if (onSuccess) {
            onSuccess(result);
          }
          resolve(result);
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : 'An error occurred';
          setError(errorMessage);
          if (onError) {
            onError(err as Error);
          }
          resolve(undefined);
        }
      });
    });
  };

  const clearError = () => setError(null);

  return {
    isPending,
    error,
    handleSubmit,
    clearError,
  };
}
