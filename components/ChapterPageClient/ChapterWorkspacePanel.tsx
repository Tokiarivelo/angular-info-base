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
  const t = useTranslations('chapterWorkspace');
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
    <div className="h-full flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
      {/* Tabs Header */}
      <div className="flex items-center px-4 pt-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <TabButton
          active={activeTab === 'live-coding'}
          onClick={() => setActiveTab('live-coding')}
          icon={<Code2 className="w-4 h-4" />}
          label={t('tabs.liveCode')}
        />
        <TabButton
          active={activeTab === 'preview'}
          onClick={() => setActiveTab('preview')}
          icon={<Monitor className="w-4 h-4" />}
          label={t('tabs.preview')}
        />
        <TabButton
          active={activeTab === 'screenshot'}
          onClick={() => setActiveTab('screenshot')}
          icon={<UploadCloud className="w-4 h-4" />}
          label={t('tabs.submission')}
        />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'live-coding' && (
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            {/* Toolbar */}
            <div className="h-10 bg-[#252526] border-b border-[#1e1e1e] flex items-center px-4 justify-between select-none">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>explorer</span>
                <span className="opacity-30">/</span>
                <span className="text-blue-400 font-medium">src</span>
                <span className="opacity-30">/</span>
                <span className="text-yellow-400 font-medium">app</span>
              </div>
              <div className="flex gap-1.5 opacity-50">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
              </div>
            </div>
            <div className="flex-1 bg-[#1e1e1e] overflow-hidden">
              <LiveCodingMockup />
            </div>
          </div>
        )}

        {activeTab === 'screenshot' && (
          <div className="h-full p-6 md:p-8 overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('submission.title')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {t('submission.description')}
                </p>
              </div>

              {/* Project Links Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('submission.repositories')}
                  </h3>
                </div>

                <div className="p-6">
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
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-indigo-600 text-white rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
                      >
                        {isPending ? t('submission.saving') : t('submission.save')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Screenshots Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('submission.visualProof')}
                  </h3>
                </div>

                <div className="p-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {t('submission.visualProofDescription')}
                  </p>
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
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="h-full flex flex-col bg-gray-100 dark:bg-black animate-in fade-in duration-300">
            {chapter.livePreviewUrl ? (
              <>
                <div className="flex items-center justify-between p-2 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-xs shadow-sm z-10">
                  <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 max-w-md w-full">
                    <div className="p-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className="truncate text-gray-600 dark:text-gray-300 font-mono flex-1 text-center">
                      {chapter.livePreviewUrl}
                    </span>
                  </div>

                  <a
                    href={chapter.livePreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <span>{t('preview.openNewTab')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex-1 bg-white relative">
                  <iframe
                    src={chapter.livePreviewUrl}
                    className="w-full h-full border-0 shadow-inner"
                    title={t('preview.title')}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                  {/* Overlay for iframe loading state could go here */}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Monitor className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('preview.emptyTitle')}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('preview.emptyDescription')}
                  </p>
                </div>
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
      className={`relative flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-blue-500 rounded-t-lg ${
        active
          ? 'text-blue-600 dark:text-blue-400 bg-transparent'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
    >
      {icon}
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 shadow-[0_-1px_6px_rgba(37,99,235,0.4)]"></div>
      )}
    </button>
  );
}
