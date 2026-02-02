'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';

interface CourseImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  title?: string;
  description?: string;
}

export default function CourseImageUpload({
  value,
  onChange,
  title,
  description,
}: CourseImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error('Image upload error:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!title) {
      setError('Please enter a course title first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-image-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          contentSummary: `Course cover for "${title}". ${description || ''}`,
          generateImage: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.imageUrl) {
        onChange(data.imageUrl);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('No image was generated');
      }
    } catch (error) {
      console.error('AI image generation error:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to generate image'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Course Jacket Image
        </label>
        {(!value || value) && (
          <button
            type="button"
            onClick={handleGenerateImage}
            disabled={isGenerating || isUploading || !title}
            className="text-xs flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        )}
      </div>

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-blue-400'
        }`}
      >
        {value ? (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 group">
            <img
              src={value}
              alt="Course Jacket"
              className="w-full h-full object-cover"
            />
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => onChange(null)}
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
              <button
                onClick={handleGenerateImage}
                type="button"
                disabled={isGenerating || !title}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm text-sm disabled:opacity-75"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Regenerate
              </button>
            </div>

            {(isUploading || isGenerating) && (
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {isGenerating ? 'Generating image...' : 'Uploading image...'}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            {isUploading ? (
              <Loader2 className="w-10 h-10 mb-3 text-blue-600 animate-spin" />
            ) : isGenerating ? (
              <Loader2 className="w-10 h-10 mb-3 text-purple-600 animate-spin" />
            ) : (
              <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
            )}

            <p className="text-sm font-medium">
              {isUploading
                ? 'Uploading...'
                : isGenerating
                  ? 'Generating AI Image...'
                  : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs mt-1 text-gray-400">
              SVG, PNG, JPG or GIF (max. 5MB)
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
