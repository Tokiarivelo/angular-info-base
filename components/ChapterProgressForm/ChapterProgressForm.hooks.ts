import { startTransition, useEffect, useTransition } from 'react';
import {
  updateChapterProgress,
  addScreenshotToProgress,
  removeScreenshotFromProgress,
  toggleChapterCompletion,
} from '@/lib/actions';
import { Screenshot } from '@/types/chapter.types';
import { useChapterProgressStore } from './ChapterProgressForm.store';
import { ChapterProgressFormData } from './ChapterProgressForm.schema';

export function useChapterProgress(
  chapterId: string,
  initialProgress: {
    repositoryUrl: string | null;
    websiteUrl: string | null;
    screenshots: Screenshot[];
    completed: boolean;
  } | null
) {
  const [isPending, startTransitionFn] = useTransition();
  const {
    screenshots,
    isUploading,
    uploadError,
    setScreenshots,
    addScreenshot,
    removeScreenshot,
    setIsUploading,
    setUploadError,
  } = useChapterProgressStore();

  // Initialize store with initial data
  useEffect(() => {
    if (initialProgress?.screenshots) {
      setScreenshots(initialProgress.screenshots);
    }
  }, [initialProgress?.screenshots, setScreenshots]);

  const onSubmit = async (data: ChapterProgressFormData) => {
    startTransitionFn(async () => {
      try {
        const formData = new FormData();
        if (data.repositoryUrl)
          formData.append('repositoryUrl', data.repositoryUrl);
        if (data.websiteUrl) formData.append('websiteUrl', data.websiteUrl);

        await updateChapterProgress(chapterId, formData);
      } catch (error) {
        console.error('Failed to update progress:', error);
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const { url, publicId } = await response.json();

      startTransitionFn(async () => {
        try {
          const result = await addScreenshotToProgress(
            chapterId,
            url,
            publicId
          );
          addScreenshot(result.screenshot);
        } catch (error) {
          console.error('Failed to save screenshot:', error);
          setUploadError('Failed to save screenshot to progress');
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(
        error instanceof Error ? error.message : 'Failed to upload file'
      );
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveScreenshot = async (screenshotId: string) => {
    startTransitionFn(async () => {
      try {
        await removeScreenshotFromProgress(screenshotId, chapterId);
        removeScreenshot(screenshotId);
      } catch (error) {
        console.error('Failed to remove screenshot:', error);
      }
    });
  };

  const handleToggleCompletion = async () => {
    startTransitionFn(async () => {
      await toggleChapterCompletion(chapterId, !initialProgress?.completed);
    });
  };

  return {
    isPending,
    isUploading,
    uploadError,
    screenshots,
    onSubmit,
    handleFileUpload,
    handleRemoveScreenshot,
    handleToggleCompletion,
  };
}
