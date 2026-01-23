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

export default function ChapterPageClient({
  id,
  user,
}: {
  id: string;
  user: User;
}) {
  const { data, isLoading, error } = useChapterData(id);

  // We call the progress hook unconditionally, but handle loading/missing data by rendering fallback/loading states before usage
  // To avoid hook rules violation, we use a key or conditional return after hook calls if possible.
  // Ideally, useChapterData should return the data needed to initialize useChapterProgress
  // However, useChapterProgress needs 'progress' which comes from 'data'.
  // If data is missing, we can pass null/undefined to useChapterProgress (needs check).

  // Safe destructuring with default or null
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Chapter not found
          </h1>
          <Link href="/courses" className="text-primary hover:underline">
            Go back to courses
          </Link>
        </div>
      </div>
    );
  }

  const { chapter, allChapters } = data;
  const currentIndex = allChapters.findIndex((ch) => ch.id === id);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header - Fixed to top */}
      <div className="flex-shrink-0 border-b z-10 bg-background">
        <Header user={user} variant="user" />
      </div>

      {/* Main Content - Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile View: Content only (or handled via internal state if needed, but per original code: content takes full width) */}
        <div className="lg:hidden flex-1 min-w-0 overflow-hidden">
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
          <Panel defaultSize={50} minSize={20}>
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

          <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

          <Panel defaultSize={50} minSize={20}>
            <div className="h-full flex flex-col overflow-hidden">
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
