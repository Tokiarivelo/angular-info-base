import { useState, useRef } from 'react';
import { createChecklistFromFile } from '@/lib/actions';
import { useFormSubmit } from '@/components/shared/hooks';

export function useFileUploadChecklist() {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isPending, error, handleSubmit, clearError } = useFormSubmit();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    await handleSubmit(
      async () => {
        await createChecklistFromFile(formData);
      },
      () => {
        setIsOpen(false);
        setFileName(null);
        form.reset();
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      clearError();
    } else {
      setFileName(null);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setFileName(null);
    clearError();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    isOpen,
    setIsOpen,
    fileName,
    error,
    isPending,
    fileInputRef,
    handleFormSubmit,
    handleFileChange,
    handleCancel,
  };
}
