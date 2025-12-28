import { useState, useRef } from 'react';
import { createChecklistFromFile } from '@/lib/actions';
import { useFormSubmit } from '@/components/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';

export function useFileUploadChecklist() {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragActive, setIsDragActive] = useState(false);

  const { isPending, error, handleSubmit, clearError } = useFormSubmit();
  const queryClient = useQueryClient();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    await handleSubmit(
      async () => {
        await createChecklistFromFile(formData);
        queryClient.invalidateQueries({ queryKey: ['checklists'] });
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Validate file type if needed, or just set it
      // For now we just check extensions in the input, but here we might want to be safe
      // Ideally update the input's files property so standard form submission works or
      // handle manually. Since we use creating FormData from e.currentTarget in handleFormSubmit,
      // we need to make sure the file input actually has the file.
      // However, we can't programmatically set file input value to a dropped file easily in all browsers
      // for security reasons, BUT we can use DataTransfer object.

      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;

        // Trigger generic change handler logic
        setFileName(file.name);
        clearError();
      }
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
    isDragActive,
    handleFormSubmit,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCancel,
  };
}
