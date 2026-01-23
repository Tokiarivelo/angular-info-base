'use client';

import { useState } from 'react';
import { Image, Monitor, Code2, ExternalLink } from 'lucide-react';
import ChapterScreenshotUpload from '@/components/ChapterProgressForm/components/ChapterScreenshotUpload';
import ChapterLinksForm from '@/components/ChapterProgressForm/components/ChapterLinksForm';
import LiveCodingMockup from './LiveCodingMockup';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  chapterProgressSchema,
  ChapterProgressFormData,
} from '@/components/ChapterProgressForm/ChapterProgressForm.schema';

interface ChapterWorkspacePanelProps {
  chapterId: string;
  chapter: any;
  progress: any;
  // State from hook
  isPending: boolean;
  isUploading: boolean;
  uploadError: string | null;
  screenshots: any[];
  // Handlers
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveScreenshot: (id: string) => Promise<void>;
  onSubmit: (data: ChapterProgressFormData) => void;
}

type Tab = 'screenshot' | 'preview' | 'live-coding';

export default function ChapterWorkspacePanel({
  chapterId,
  chapter,
  progress,
  isPending,
  isUploading,
  uploadError,
  screenshots,
  handleFileUpload,
  handleRemoveScreenshot,
  onSubmit,
}: ChapterWorkspacePanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('live-coding');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChapterProgressFormData>({
    resolver: zodResolver(chapterProgressSchema),
    defaultValues: {
      repositoryUrl: progress?.repositoryUrl || '',
      websiteUrl: progress?.websiteUrl || '',
    },
  });

  return (
    <div className="h-full flex flex-col bg-background/50 border-l">
      {/* Tabs Header */}
      <div className="flex items-center border-b bg-muted/30">
        <button
          onClick={() => setActiveTab('live-coding')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'live-coding'
              ? 'border-primary text-primary bg-background'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Live Coding
        </button>
        <button
          onClick={() => setActiveTab('screenshot')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'screenshot'
              ? 'border-primary text-primary bg-background'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Image className="w-4 h-4" />
          Submission
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'preview'
              ? 'border-primary text-primary bg-background'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Monitor className="w-4 h-4" />
          Preview
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'live-coding' && (
          <div className="h-full p-4">
            <LiveCodingMockup />
          </div>
        )}

        {activeTab === 'screenshot' && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-xl mx-auto space-y-8">
              {/* Project Links */}
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h3 className="text-lg font-medium mb-4">Project Links</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <ChapterLinksForm
                    register={register}
                    errors={errors}
                    isPending={isPending}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isPending ? 'Saving...' : 'Save Links'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Screenshots */}
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h3 className="text-lg font-medium mb-4">Screenshots</h3>
                <ChapterScreenshotUpload
                  screenshots={screenshots}
                  onUpload={handleFileUpload}
                  onRemove={handleRemoveScreenshot}
                  isUploading={isUploading}
                  uploadError={uploadError}
                  isPending={isPending}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="h-full flex flex-col">
            {chapter.livePreviewUrl ? (
              <>
                <div className="flex items-center justify-between p-2 px-4 bg-muted/30 border-b text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 truncate max-w-md">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {chapter.livePreviewUrl}
                  </div>
                  <a
                    href={chapter.livePreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Open New Tab <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex-1 bg-white relative">
                  <iframe
                    src={chapter.livePreviewUrl}
                    className="w-full h-full border-0"
                    title="Live Preview"
                  />
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                <Monitor className="w-12 h-12 mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">
                  No Live Preview Available
                </h3>
                <p className="text-sm max-w-xs">
                  This chapter doesn&apos;t have a live preview URL configured.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
