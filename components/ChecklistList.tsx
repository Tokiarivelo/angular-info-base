'use client';

import Link from 'next/link';
import { deleteChecklist } from '@/lib/actions';
import { useState } from 'react';

type ChecklistWithItems = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date | string;
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
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
            />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No checklists
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new checklist.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {checklists.map((checklist) => {
        const completedCount = checklist.items.filter(
          (item) => item.done
        ).length;
        const totalCount = checklist.items.length;
        const percentage =
          totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

        return (
          <div
            key={checklist.id}
            className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-indigo-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                  />
                </svg>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(checklist.id);
                }}
                disabled={deletingId === checklist.id}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-50"
                title="Delete checklist"
              >
                {deletingId === checklist.id ? (
                  <span className="w-5 h-5 block animate-spin border-2 border-gray-300 border-t-red-500 rounded-full" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                )}
              </button>
            </div>

            <Link href={`/checklist/${checklist.id}`} className="block">
              <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                {checklist.title}
              </h3>
              {checklist.description && (
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                  {checklist.description}
                </p>
              )}
              {!checklist.description && <div className="h-14"></div>}

              <div className="mt-4">
                <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  <span>Progress</span>
                  <span className={percentage === 100 ? 'text-green-600' : ''}>
                    {Math.round(percentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${
                      percentage === 100 ? 'bg-green-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    {totalCount} Task{totalCount !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                    View
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 ml-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
