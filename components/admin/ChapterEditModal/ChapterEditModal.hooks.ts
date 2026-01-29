import { useState, useRef, useEffect } from 'react';
import {
  Chapter,
  ChapterUpdateData,
  ParsedContent,
} from './ChapterEditModal.types';
import { parseImportedFile } from './ChapterEditModal.utils';
import { EditorBlock } from '../ChapterRichContentEditor/ChapterRichContentEditor.types';

export function useChapterEditModal(chapter?: Chapter | null) {
  const [title, setTitle] = useState(chapter?.title || '');
  const [description, setDescription] = useState(chapter?.description || '');
  const [imageUrl, setImageUrl] = useState(chapter?.imageUrl || '');
  const [livePreviewUrl, setLivePreviewUrl] = useState(
    chapter?.livePreviewUrl || ''
  );

  // New flexible content
  const [content, setContent] = useState<EditorBlock[]>(chapter?.content || []);

  // Backward compatibility: If no content but old fields exist, convert them
  useEffect(() => {
    if (
      (!chapter?.content || chapter.content.length === 0) &&
      (chapter?.introText || chapter?.proTips)
    ) {
      const newBlocks: EditorBlock[] = [];
      if (chapter.introText) {
        newBlocks.push({
          id: `intro-legacy`,
          type: 'richText',
          content: chapter.introText,
        });
      }
      if (chapter.proTips && Array.isArray(chapter.proTips)) {
        chapter.proTips.forEach((tip: any, index: number) => {
          newBlocks.push({
            id: `tip-legacy-${index}`,
            type: 'proTip',
            title: tip.title,
            content: tip.content,
          });
        });
      }
      // Don't auto-set if we already have content to avoid overwriting
      if (newBlocks.length > 0 && content.length === 0) {
        setContent(newBlocks);
      }
    }
  }, [chapter, content.length]);

  // File Import State
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image Upload State
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error
    setImageUploadError(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please upload an image file');
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);

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
      setImageUrl(data.url);
    } catch (error) {
      console.error('Image upload error:', error);
      setImageUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);

    try {
      const parsed: ParsedContent = await parseImportedFile(file);

      // Apply parsed content
      if (parsed.content) setContent(parsed.content);
    } catch (error) {
      setImportError((error as Error).message);
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileImport = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Validate file type
      if (!file.name.endsWith('.csv') && !file.name.endsWith('.md')) {
        setImportError('Please upload a .csv or .md file');
        return;
      }

      setIsImporting(true);
      setImportError(null);

      try {
        const parsed: ParsedContent = await parseImportedFile(file);
        if (parsed.content) setContent(parsed.content);
      } catch (error) {
        setImportError((error as Error).message);
      } finally {
        setIsImporting(false);
      }
    }
  };

  const getUpdateData = (): ChapterUpdateData => {
    return {
      title,
      description,
      imageUrl,
      livePreviewUrl,
      content, // New field
      // Don't send old fields if possible, or send empty to clear them if we are migrating?
      // For now, let's just assume we are saving to the new structure.
      // Server action should handle the destination.
    };
  };

  return {
    // Basic fields
    title,
    setTitle,
    description,
    setDescription,
    imageUrl,
    setImageUrl,
    isUploadingImage,
    imageUploadError,
    handleImageUpload,
    handleRemoveImage,
    livePreviewUrl,
    setLivePreviewUrl,
    // Rich content
    content,
    setContent,
    // File import
    fileInputRef,
    isImporting,
    importError,
    handleFileImport,
    triggerFileImport,
    // Drag and drop
    isDragging,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    // Data extraction
    getUpdateData,
  };
}
