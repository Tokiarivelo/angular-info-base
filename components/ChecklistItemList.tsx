'use client';

import { useState } from 'react';
import {
  toggleChecklistItem,
  deleteChecklistItem,
  updateChecklistItem,
} from '@/lib/actions';

type ChecklistItem = {
  id: string;
  title: string;
  done: boolean;
  notes: string | null;
  updatedAt: Date;
};

export default function ChecklistItemList({
  items,
}: {
  items: ChecklistItem[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function handleToggle(id: string, currentDone: boolean) {
    setProcessingId(id);
    try {
      await toggleChecklistItem(id, !currentDone);
    } catch (error) {
      console.error('Error toggling item:', error);
      alert('Failed to update item');
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setProcessingId(id);
    try {
      await deleteChecklistItem(id);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    } finally {
      setProcessingId(null);
    }
  }

  function startEdit(item: ChecklistItem) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditNotes(item.notes || '');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle('');
    setEditNotes('');
  }

  async function handleUpdate(e: React.FormEvent, id: string) {
    e.preventDefault();
    setProcessingId(id);

    const formData = new FormData();
    formData.append('title', editTitle);
    formData.append('notes', editNotes);

    try {
      await updateChecklistItem(id, formData);
      setEditingId(null);
      setEditTitle('');
      setEditNotes('');
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item');
    } finally {
      setProcessingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No items yet. Add your first one!</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {items.map((item) => {
          const isEditing = editingId === item.id;
          const isProcessing = processingId === item.id;

          return (
            <li key={item.id} className="px-6 py-4">
              {isEditing ? (
                <form onSubmit={(e) => handleUpdate(e, item.id)}>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Item title"
                    />
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      rows={2}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Notes (optional)"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isProcessing ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => handleToggle(item.id, item.done)}
                    disabled={isProcessing}
                    className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        item.done
                          ? 'line-through text-gray-400'
                          : 'text-gray-900'
                      }`}
                    >
                      {item.title}
                    </p>
                    {item.notes && (
                      <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Updated: {new Date(item.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      disabled={isProcessing}
                      className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isProcessing}
                      className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
