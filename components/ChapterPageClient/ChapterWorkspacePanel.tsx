'use client';

import { useState } from 'react';
import {
  Image as ImageIcon,
  Monitor,
  Code2,
  ExternalLink,
  Github,
  Globe,
  UploadCloud,
  Link as LinkIcon,
  Settings,
  X,
  ChevronRight,
} from 'lucide-react';
import ChapterScreenshotUpload from '@/components/ChapterProgressForm/components/ChapterScreenshotUpload';
import ChapterLinksForm from '@/components/ChapterProgressForm/components/ChapterLinksForm';
import LiveCodingMockup from './LiveCodingMockup';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  chapterProgressSchema,
  ChapterProgressFormData,
} from '@/components/ChapterProgressForm/ChapterProgressForm.schema';
import { useTranslations } from 'next-intl';

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

// Adjusted types without live-coding
type Tab = 'screenshot' | 'preview';

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
  const t = useTranslations('chapterWorkspace');
  // Default to screenshot since live-coding is hidden
  const [activeTab, setActiveTab] = useState<Tab>('preview');
  const [showSettings, setShowSettings] = useState(false);

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

  const hasLinks = !!(progress?.repositoryUrl || progress?.websiteUrl);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800">
      {/* Modern Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex gap-1 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg">
          <TabButton
            active={activeTab === 'preview'}
            onClick={() => {
              setActiveTab('preview');
              setShowSettings(false);
            }}
            icon={<Monitor className="w-3.5 h-3.5" />}
            label={t('tabs.preview')}
          />
          <TabButton
            active={activeTab === 'screenshot'}
            onClick={() => {
              setActiveTab('screenshot');
              setShowSettings(false);
            }}
            icon={<UploadCloud className="w-3.5 h-3.5" />}
            label={t('tabs.submission')}
          />
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg transition-all ${
            showSettings
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          title="Project Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {/* Settings Overlay */}
        {showSettings && (
          <div className="absolute inset-0 z-30 bg-white dark:bg-gray-900 animate-in fade-in slide-in-from-right-4 duration-300 overflow-y-auto">
            <div className="p-6 md:p-8 max-w-lg mx-auto">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Project Settings
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Configure your repository and deployment links once.
                  </p>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <ChapterLinksForm
                    register={register}
                    errors={errors}
                    isPending={isPending}
                  />
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {isPending
                        ? t('submission.saving')
                        : t('submission.save')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab Views */}
        {!showSettings && activeTab === 'screenshot' && (
          <div className="h-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <ChapterScreenshotUpload
              screenshots={screenshots}
              onUpload={handleFileUpload}
              onRemove={handleRemoveScreenshot}
              isUploading={isUploading}
              uploadError={uploadError}
              isPending={isPending}
            />
          </div>
        )}

        {!showSettings && activeTab === 'preview' && (
          <div className="h-full flex flex-col bg-gray-50/50 dark:bg-black animate-in fade-in duration-300">
            {chapter.livePreviewUrl ? (
              <>
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs shadow-sm z-10">
                  {/* Address Bar-ish look */}
                  <div className="flex-1 flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 mx-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="truncate text-gray-600 dark:text-gray-400 font-mono flex-1">
                      {chapter.livePreviewUrl}
                    </span>
                  </div>

                  <a
                    href={chapter.livePreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="flex-1 bg-white relative">
                  <iframe
                    src={chapter.livePreviewUrl}
                    className="w-full h-full border-0"
                    title={t('preview.title')}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 transition-transform hover:rotate-0">
                  <Monitor className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('preview.emptyTitle')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {t('preview.emptyDescription')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
        active
          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-600'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
