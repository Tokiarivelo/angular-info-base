'use client';

import Link from 'next/link';
import Header from '@/components/shared/Header/Header';
import { useChecklistDetail } from './ChecklistDetailClient.hooks';
import ChecklistItemList from '@/components/ChecklistItemList';
import CreateChecklistItemForm from '@/components/CreateChecklistItemForm';

import { User } from 'next-auth';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checklist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = (error as Error).message;
    // Redirects are handled in the hook, but we render this briefly or if redirect fails/is distinct
    if (errorMessage !== 'NOT_FOUND' && errorMessage !== 'UNAUTHORIZED') {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error loading checklist
            </h1>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <Link
              href="/checklist"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go back to checklists
            </Link>
          </div>
        </div>
      );
    }
    return null; // Don't render anything while redirecting
  }

  if (!checklist) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} variant="user" />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/checklist"
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Back to Checklists
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {checklist.title}
            </h1>
            {checklist.description && (
              <p className="text-gray-600">{checklist.description}</p>
            )}
          </div>

          <div className="mb-6">
            <CreateChecklistItemForm checklistId={checklist.id} />
          </div>

          <ChecklistItemList items={checklist.items} />
        </div>
      </div>
    </div>
  );
}
