'use client';

import Link from 'next/link';
import Header from '@/components/shared/Header/Header';
import { useChecklistDetail } from './ChecklistDetailClient.hooks';
import ChecklistItemList from '@/components/ChecklistItemList';
import CreateChecklistItemForm from '@/components/CreateChecklistItemForm';

import { User } from 'next-auth';
import { ArrowLeft, LayoutList, Calendar, Loader2 } from 'lucide-react';

export default function ChecklistDetailClient({
  id,
  user,
}: {
  id: string;
  user: User;
}) {
  const { checklist, isLoading, error } = useChecklistDetail(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
        <Header user={user} variant="user" />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Loading checklist details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage !== 'NOT_FOUND' && errorMessage !== 'UNAUTHORIZED') {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
          <Header user={user} variant="user" />
          <div className="flex-1 flex items-center justify-center pt-20">
            <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Unable to load checklist
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {errorMessage}
              </p>
              <Link
                href="/checklist"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Checklists
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  if (!checklist) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors pb-20">
      <Header user={user} variant="user" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/checklist"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Checklists
          </Link>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <LayoutList className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                {checklist.title}
              </h1>
              {checklist.description && (
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 max-w-2xl leading-relaxed">
                  {checklist.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Created{' '}
                  {checklist.createdAt
                    ? new Date(checklist.createdAt).toLocaleDateString()
                    : 'Unknown'}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              {/* Future: Add edit/delete buttons here */}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Tasks
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-2.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
              {checklist.items.length} items
            </span>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <CreateChecklistItemForm checklistId={checklist.id} />
            </div>

            <div className="mt-6">
              <ChecklistItemList items={checklist.items} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
