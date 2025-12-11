'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import ChecklistItemList from '@/components/ChecklistItemList';
import CreateChecklistItemForm from '@/components/CreateChecklistItemForm';

interface ChecklistItem {
  id: string;
  title: string;
  notes: string | null;
  done: boolean;
  order: number;
  checklistId: string;
  createdAt: string;
  updatedAt: string;
}

interface Checklist {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

async function fetchChecklist(id: string): Promise<Checklist> {
  const response = await fetch(`/api/checklists/${id}`);

  if (response.status === 404) {
    throw new Error('NOT_FOUND');
  }

  if (response.status === 403) {
    throw new Error('UNAUTHORIZED');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch checklist');
  }

  return response.json();
}

export default function ChecklistDetailClient({ id }: { id: string }) {
  const router = useRouter();

  const { data: checklist, isLoading, error } = useQuery({
    queryKey: ['checklist', id],
    queryFn: () => fetchChecklist(id),
  });

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
    if (errorMessage === 'NOT_FOUND') {
      notFound();
    }
    if (errorMessage === 'UNAUTHORIZED') {
      router.push('/checklist');
      return null;
    }
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

  if (!checklist) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/checklist"
                className="text-xl font-bold text-gray-900"
              >
                Angular Checklist
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/courses"
                className="text-gray-700 hover:text-gray-900"
              >
                Courses
              </Link>
              <Link
                href="/checklist"
                className="text-gray-700 hover:text-gray-900"
              >
                Checklists
              </Link>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-gray-900"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
