'use client';

import { useState, useTransition } from 'react';
import {
  updateChapterProgress,
  addScreenshotToProgress,
  removeScreenshotFromProgress,
  toggleChapterCompletion,
} from '@/lib/actions';

interface Screenshot {
  id: string;
  url: string;
  publicId: string | null;
  caption: string | null;
  userId?: string;
  progressId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserChapterProgress {
  id: string;
  userId: string;
  chapterId: string;
  repositoryUrl: string | null;
  websiteUrl: string | null;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ChapterProgressFormProps {
  chapterId: string;
  progress: (UserChapterProgress & { screenshots: Screenshot[] }) | null;
}

export default function ChapterProgressForm({
  chapterId,
  progress,
}: ChapterProgressFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [repositoryUrl, setRepositoryUrl] = useState(
    progress?.repositoryUrl || ''
  );
  const [websiteUrl, setWebsiteUrl] = useState(progress?.websiteUrl || '');
  const [screenshots, setScreenshots] = useState<Screenshot[]>(
    progress?.screenshots || []
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

      // Add the screenshot to the progress
      startTransition(async () => {
        try {
          const result = await addScreenshotToProgress(chapterId, url, publicId);
          // Update local state with new screenshot
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
      // Reset file input
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
      await toggleChapterCompletion(chapterId, !progress?.completed);
    });
  };

  return (
    <div className="space-y-6">
      {/* Links Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="repositoryUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            GitHub Repository URL
          </label>
          <input
            type="url"
            id="repositoryUrl"
            name="repositoryUrl"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="websiteUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Deployed Website URL
          </label>
          <input
            type="url"
            id="websiteUrl"
            name="websiteUrl"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://your-project.vercel.app"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving...' : 'Save Links'}
        </button>
      </form>

      {/* Screenshot Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Screenshots
        </label>
        <div className="space-y-3">
          <div>
            <input
              type="file"
              id="screenshot"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading || isPending}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {isUploading && (
              <p className="text-sm text-blue-600 mt-1">Uploading...</p>
            )}
            {uploadError && (
              <p className="text-sm text-red-600 mt-1">{uploadError}</p>
            )}
          </div>

          {/* Screenshot Gallery */}
          {screenshots.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {screenshots.map((screenshot) => (
                <div key={screenshot.id} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={screenshot.url}
                    alt={screenshot.caption || `Screenshot ${screenshot.id}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveScreenshot(screenshot.id)}
                    disabled={isPending}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:opacity-50"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Completion Toggle */}
      <div className="pt-4 border-t">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={progress?.completed || false}
            onChange={handleToggleCompletion}
            disabled={isPending}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className="text-sm font-medium text-gray-700">
            Mark chapter as completed
          </span>
        </label>
      </div>
    </div>
  );
}
