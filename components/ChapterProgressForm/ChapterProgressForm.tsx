'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChapterProgressFormProps } from './ChapterProgressForm.types';
import { useChapterProgress } from './ChapterProgressForm.hooks';
import {
  chapterProgressSchema,
  ChapterProgressFormData,
} from './ChapterProgressForm.schema';
import ChapterLinksForm from './components/ChapterLinksForm';
import ChapterScreenshotUpload from './components/ChapterScreenshotUpload';
import ChapterCompletionToggle from './components/ChapterCompletionToggle';

export default function ChapterProgressForm({
  chapterId,
  progress,
}: ChapterProgressFormProps) {
  const {
    isPending,
    isUploading,
    uploadError,
    screenshots,
    onSubmit,
    handleFileUpload,
    handleRemoveScreenshot,
    handleToggleCompletion,
  } = useChapterProgress(chapterId, progress);

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
    <div className="space-y-6">
      {/* Links Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ChapterLinksForm
          register={register}
          errors={errors}
          isPending={isPending}
        />
      </form>

      {/* Screenshot Upload */}
      <ChapterScreenshotUpload
        screenshots={screenshots}
        onUpload={handleFileUpload}
        onRemove={handleRemoveScreenshot}
        isUploading={isUploading}
        uploadError={uploadError}
        isPending={isPending}
      />

      {/* Completion Toggle */}
      <ChapterCompletionToggle
        completed={progress?.completed || false}
        onToggle={handleToggleCompletion}
        isPending={isPending}
      />
    </div>
  );
}
