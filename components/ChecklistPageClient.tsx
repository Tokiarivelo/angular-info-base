'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import ChecklistList from '@/components/ChecklistList';
import CreateChecklistForm from '@/components/CreateChecklistForm';
import FileUploadChecklistForm from '@/components/FileUploadChecklistForm';

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

async function fetchChecklists(): Promise<Checklist[]> {
  const response = await fetch('/api/checklists');

  if (!response.ok) {
    throw new Error('Failed to fetch checklists');
  }

  return response.json();
}

export default function ChecklistPageClient() {
  const { data: checklists, isLoading, error } = useQuery({
    queryKey: ['checklists'],
    queryFn: fetchChecklists,
  });

  if (isLoading) {
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
                  className="text-gray-700 hover:text-gray-900 font-medium"
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
          <div className="px-4 py-6 sm:px-0 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading checklists...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
                  className="text-gray-700 hover:text-gray-900 font-medium"
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
          <div className="px-4 py-6 sm:px-0 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error loading checklists
            </h1>
            <p className="text-gray-600">{(error as Error).message}</p>
          </div>
        </div>
      </div>
    );
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
                className="text-gray-700 hover:text-gray-900 font-medium"
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              My Checklists
            </h1>
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
