'use client';

import Link from 'next/link';
import Header from '@/components/shared/Header/Header';
import { useChecklists } from './ChecklistPageClient.hooks';
import ChecklistList from '@/components/ChecklistList';
import CreateChecklistForm from '@/components/CreateChecklistForm';
import FileUploadChecklistForm from '@/components/FileUploadChecklistForm';

import { User } from 'next-auth';

export default function ChecklistPageClient({ user }: { user: User }) {
  const { checklists, isLoading, error } = useChecklists();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <Header user={user} variant="user" />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading checklists...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <Header user={user} variant="user" />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error loading checklists
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {(error as Error).message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header user={user} variant="user" />

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                My Checklists
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your tasks and track your progress.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <CreateChecklistForm />
              <FileUploadChecklistForm />
            </div>
          </div>

          <ChecklistList checklists={checklists || []} />
        </div>
      </div>
    </div>
  );
}
