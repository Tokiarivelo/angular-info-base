import { useState } from 'react';
import {
  toggleChecklistItem,
  deleteChecklistItem,
  updateChecklistItem,
} from '@/lib/actions';
import { useDelete } from '@/components/shared/hooks';

export function useChecklistItemActions() {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleToggle = async (id: string, currentDone: boolean) => {
    setProcessingId(id);
    try {
      await toggleChecklistItem(id, !currentDone);
    } catch (error) {
      console.error('Error toggling item:', error);
      alert('Failed to update item');
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdate = async (id: string, formData: FormData) => {
    setProcessingId(id);
    try {
      await updateChecklistItem(id, formData);
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item');
    } finally {
      setProcessingId(null);
    }
  };

  const { handleDelete: performDelete } = useDelete(async (id: string) => {
    await deleteChecklistItem(id);
  }, 'Are you sure you want to delete this item?');

  const handleDelete = async (id: string) => {
    setProcessingId(id);
    try {
      await performDelete(id);
    } finally {
      setProcessingId(null);
    }
  };

  return {
    handleToggle,
    handleDelete,
    handleUpdate,
    processingId,
  };
}

export function useChecklistItemEdit(item: {
  title: string;
  notes: string | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editNotes, setEditNotes] = useState(item.notes || '');

  const startEdit = () => {
    setIsEditing(true);
    setEditTitle(item.title);
    setEditNotes(item.notes || '');
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle(item.title);
    setEditNotes(item.notes || '');
  };

  return {
    isEditing,
    editTitle,
    setEditTitle,
    editNotes,
    setEditNotes,
    startEdit,
    cancelEdit,
    setIsEditing,
  };
}
