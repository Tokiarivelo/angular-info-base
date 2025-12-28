'use client';

import { Screenshot } from '@/types/chapter.types';

interface ChapterScreenshotUploadProps {
  screenshots: Screenshot[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  isUploading: boolean;
  uploadError: string | null;
  isPending: boolean;
}

export default function ChapterScreenshotUpload({
  screenshots,
  onUpload,
  onRemove,
  isUploading,
  uploadError,
  isPending,
}: ChapterScreenshotUploadProps) {
  return (
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
            onChange={onUpload}
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
                  onClick={() => onRemove(screenshot.id)}
                  disabled={isPending}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:opacity-50"
                  aria-label="Remove screenshot"
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
  );
}
