'use client';

import Link from 'next/link';
import { deleteChecklist } from '@/lib/actions';
import { useState } from 'react';

type ChecklistWithItems = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  items: Array<{
    id: string;
    done: boolean;
  }>;
};

export default function ChecklistList({
  checklists,
}: {
  checklists: ChecklistWithItems[];
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this checklist?')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteChecklist(id);
    } catch (error) {
      console.error('Error deleting checklist:', error);
      alert('Failed to delete checklist');
    } finally {
      setDeletingId(null);
    }
  }

  if (checklists.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">
          No checklists yet. Create your first one!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {checklists.map((checklist) => {
        const completedCount = checklist.items.filter((item) => item.done).length;
        const totalCount = checklist.items.length;

        return (
          <div
            key={checklist.id}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <Link
                  href={`/checklist/${checklist.id}`}
                  className="text-lg font-medium text-gray-900 hover:text-blue-600"
                >
                  {checklist.title}
                </Link>
                <button
                  onClick={() => handleDelete(checklist.id)}
                  disabled={deletingId === checklist.id}
                  className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                  title="Delete checklist"
                >
                  {deletingId === checklist.id ? '...' : '✕'}
                </button>
              </div>

              {checklist.description && (
                <p className="text-sm text-gray-500 mb-3">
                  {checklist.description}
                </p>
              )}

              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>
                    {completedCount} / {totalCount}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href={`/checklist/${checklist.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View details →
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
