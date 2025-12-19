import { useState, useTransition } from 'react';
import {
  updateChapterProgress,
  addScreenshotToProgress,
  removeScreenshotFromProgress,
  toggleChapterCompletion,
} from '@/lib/actions';
import { Screenshot } from '@/types/chapter.types';

export function useChapterProgress(
  chapterId: string,
  initialProgress: {
    repositoryUrl: string | null;
    websiteUrl: string | null;
    screenshots: Screenshot[];
    completed: boolean;
  } | null
) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [repositoryUrl, setRepositoryUrl] = useState(
    initialProgress?.repositoryUrl || ''
  );
  const [websiteUrl, setWebsiteUrl] = useState(
    initialProgress?.websiteUrl || ''
  );
  const [screenshots, setScreenshots] = useState<Screenshot[]>(
    initialProgress?.screenshots || []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
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

      startTransition(async () => {
        try {
          const result = await addScreenshotToProgress(
            chapterId,
            url,
            publicId
          );
          setScreenshots((prev) => [...prev, result.screenshot]);
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
    startTransition(async () => {
      try {
        await removeScreenshotFromProgress(screenshotId, chapterId);
        setScreenshots((prev) => prev.filter((s) => s.id !== screenshotId));
      } catch (error) {
        console.error('Failed to remove screenshot:', error);
      }
    });
  };

  const handleToggleCompletion = async () => {
    startTransition(async () => {
      await toggleChapterCompletion(chapterId, !initialProgress?.completed);
    });
  };

  return {
    isPending,
    isUploading,
    uploadError,
    repositoryUrl,
    setRepositoryUrl,
    websiteUrl,
    setWebsiteUrl,
    screenshots,
    handleSubmit,
    handleFileUpload,
    handleRemoveScreenshot,
    handleToggleCompletion,
  };
}
