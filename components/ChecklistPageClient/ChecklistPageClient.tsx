'use client';

import Link from 'next/link';
import Header from '@/components/shared/Header/Header';
import { useChecklists } from './ChecklistPageClient.hooks';
import ChecklistList from '@/components/ChecklistList';
import CreateChecklistForm from '@/components/CreateChecklistForm';
import FileUploadChecklistForm from '@/components/FileUploadChecklistForm';
import { User } from 'next-auth';
import {
  Loader2,
  Plus,
  Upload,
  CheckSquare,
  ListChecks,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

export default function ChecklistPageClient({ user }: { user: User }) {
  const { checklists, isLoading, error } = useChecklists();
  const [activeTab, setActiveTab] = useState<'all' | 'create' | 'upload'>(
    'all'
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors flex flex-col">
        <Header user={user} variant="user" />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-blue-600 dark:text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Loading your checklists...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors flex flex-col">
        <Header user={user} variant="user" />
        <div className="flex-1 flex items-center justify-center p-4 pt-24">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl max-w-md w-full border border-red-100 dark:border-red-900/30 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Unable to Load Checklists
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {(error as Error).message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors pb-20">
      <Header user={user} variant="user" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <ListChecks className="w-8 h-8 text-blue-600 dark:text-blue-500" />
              My Checklists
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
              Organize your tasks, track progress, and stay productive. Create
              new lists manually or upload existing ones.
            </p>
          </div>

          <div className="flex gap-3 bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 self-start md:self-end">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              All Lists
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Plus className="w-4 h-4" />
              Create New
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
        </div>

        {/* Action Area */}
        {(activeTab === 'create' || activeTab === 'upload') && (
          <div className="mb-10 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30 shadow-lg relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {activeTab === 'create' ? (
                    <Plus className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Upload className="w-5 h-5 text-blue-500" />
                  )}
                  {activeTab === 'create'
                    ? 'Create a New Checklist'
                    : 'Upload Checklist File'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {activeTab === 'create'
                    ? 'Start fresh with a new list of tasks.'
                    : 'Import a JSON file containing your checklist data.'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('all')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {activeTab === 'create' ? (
              <CreateChecklistForm onSuccess={() => setActiveTab('all')} />
            ) : (
              <FileUploadChecklistForm onSuccess={() => setActiveTab('all')} />
            )}
          </div>
        )}

        {/* Checklists Grid/List */}
        <div className="space-y-6">
          {checklists && checklists.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No checklists found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                You haven&apos;t created any checklists yet. Get started by
                creating a new one or uploading an existing file.
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" />
                Create First Checklist
              </button>
            </div>
          ) : (
            <ChecklistList checklists={checklists || []} />
          )}
        </div>
      </div>
    </div>
  );
}
