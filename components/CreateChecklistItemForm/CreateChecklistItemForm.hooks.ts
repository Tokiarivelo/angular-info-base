import { useState } from 'react';
import { createChecklistItem } from '@/lib/actions';
import { useFormSubmit } from '@/components/shared/hooks';

export function useCreateChecklistItem(checklistId: string) {
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, handleSubmit } = useFormSubmit();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    await handleSubmit(
      async () => {
        await createChecklistItem(checklistId, formData);
      },
      () => {
        setIsOpen(false);
        form.reset();
      }
    );
  };

  return {
    isOpen,
    setIsOpen,
    isPending,
    handleFormSubmit,
  };
}
