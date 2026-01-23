'use client';

import { useState, useRef } from 'react';

interface ImageBlockEditorProps {
  blockId: string;
  content: string;
  onUpdate: (blockId: string, data: { content: string }) => void;
  onUpload: (blockId: string, file: File) => void;
  isUploading: boolean;
}

export default function ImageBlockEditor({
  blockId,
  content,
  onUpdate,
  onUpload,
  isUploading,
}: ImageBlockEditorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      onUpload(blockId, file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(blockId, file);
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  // Handle paste events in the URL input
  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    // Check for image in clipboard
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // If it's an image file, upload it
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          onUpload(blockId, file);
        }
        return;
      }
    }

    // If no image file, let the default paste happen (text/URL)
    // The onChange handler will validate if it's a URL
  };

  // Validate if the input is a valid image URL
  const isValidImageUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const imageExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.webp',
        '.svg',
        '.bmp',
      ];
      const pathname = urlObj.pathname.toLowerCase();
      return (
        imageExtensions.some((ext) => pathname.endsWith(ext)) ||
        url.includes('image') ||
        url.includes('img')
      );
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    onUpdate(blockId, { content: newUrl });

    // Auto-preview if it looks like an image URL
    if (newUrl && isValidImageUrl(newUrl)) {
      // The preview will automatically show because content is updated
    }
  };

  return (
    <div className="space-y-3">
      {/* URL Input and Upload Button */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold px-2 py-1 bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded uppercase">
          Image
        </span>
        <input
          type="text"
          value={content || ''}
          onChange={handleUrlChange}
          onPaste={handlePaste}
          placeholder="Paste image URL or image from clipboard"
          className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-1 text-sm text-gray-900 dark:text-white"
        />
        <span className="text-xs text-gray-500">OR</span>
        <label className="cursor-pointer px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm text-gray-700 dark:text-gray-200 transition-colors flex items-center gap-2">
          {isUploading ? (
            <>
              <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </>
          )}
        </label>
      </div>

      {/* Drop Zone or Preview */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative rounded-lg overflow-hidden transition-all ${
          content
            ? 'aspect-video bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
            : ''
        }`}
      >
        {!content ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <div
              onClick={handleDropZoneClick}
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 transition-all cursor-pointer ${
                isDragging
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-[1.02]'
                  : 'border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10'
              }`}
            >
              <span className="text-4xl mb-2">🖼️</span>
              <span className="text-sm font-medium">
                {isDragging ? 'Drop image here' : 'Drag and drop an image here'}
              </span>
              <span className="text-xs mt-1 text-gray-400">
                or click to browse files
              </span>
            </div>
          </>
        ) : (
          <div className="relative group/image">
            <img
              src={content}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <button
              onClick={() => onUpdate(blockId, { content: '' })}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-red-700"
              title="Remove Image"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
