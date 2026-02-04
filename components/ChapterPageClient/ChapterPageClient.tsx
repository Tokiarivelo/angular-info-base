'use client';

import Header from '@/components/shared/Header/Header';
import { useChapterData } from './ChapterPageClient.hooks';
import { User } from 'next-auth';
import ChapterContentPanel from './ChapterContentPanel';
import ChapterWorkspacePanel from './ChapterWorkspacePanel';
import { useChapterProgress } from '@/components/ChapterProgressForm/ChapterProgressForm.hooks';
import Link from 'next/link';
import {
  Panel,
  Group as PanelGroup,
  Separator as PanelResizeHandle,
} from 'react-resizable-panels';
import { Loader2, AlertCircle, ChevronLeft } from 'lucide-react';

export default function ChapterPageClient({
  id,
  user,
}: {
  id: string;
  user: User;
}) {
  const { data, isLoading, error } = useChapterData(id);
  const progress = data?.progress ?? null;

  const {
    isPending,
    isUploading,
    uploadError,
    screenshots,
    handleFileUpload,
    handleRemoveScreenshot,
    handleToggleCompletion,
    onSubmit,
  } = useChapterProgress(id, progress);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 opacity-20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
            Loading chapter content...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Chapter Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            The chapter you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have permission to view it.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:scale-105 transition-transform w-full"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const { chapter, allChapters } = data;
  const currentIndex = allChapters.findIndex((ch) => ch.id === id);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden transition-colors">
      {/* Header - Fixed to top */}
      <div className="flex-shrink-0 h-16 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <Header user={user} variant="user" />
      </div>

      {/* Main Content - Split Pane */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile View: Content only */}
        <div className="lg:hidden flex-1 min-w-0 overflow-hidden bg-white dark:bg-gray-900">
          <ChapterContentPanel
            chapter={chapter}
            allChapters={allChapters}
            currentIndex={currentIndex}
            completed={progress?.completed || false}
            onToggleCompletion={handleToggleCompletion}
            isPending={isPending}
          />
        </div>

        {/* Desktop View: Resizable Panels */}
        <PanelGroup
          orientation="horizontal"
          className="hidden lg:flex flex-1 overflow-hidden"
        >
          {/* Left Panel: Course Content */}
          <Panel
            defaultSize={45}
            minSize={25}
            className="bg-white dark:bg-gray-900"
          >
            <div className="h-full flex flex-col overflow-hidden">
              <ChapterContentPanel
                chapter={chapter}
                allChapters={allChapters}
                currentIndex={currentIndex}
                completed={progress?.completed || false}
                onToggleCompletion={handleToggleCompletion}
                isPending={isPending}
              />
            </div>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-500 transition-colors cursor-col-resize flex items-center justify-center group focus:outline-none">
            <div className="h-8 w-1 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-white transition-colors" />
          </PanelResizeHandle>

          {/* Right Panel: Workspace (Live Coding / Submission) */}
          <Panel
            defaultSize={55}
            minSize={30}
            className="bg-gray-50 dark:bg-gray-950"
          >
            <div className="h-full flex flex-col overflow-hidden border-l border-gray-200 dark:border-gray-800 text-sm">
              <ChapterWorkspacePanel
                chapterId={id}
                chapter={chapter}
                progress={progress}
                isPending={isPending}
                isUploading={isUploading}
                uploadError={uploadError}
                screenshots={screenshots}
                handleFileUpload={handleFileUpload}
                handleRemoveScreenshot={handleRemoveScreenshot}
                onSubmit={onSubmit}
              />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
