import { useState, useEffect, useRef } from 'react';
import {
  Chapter,
  EditorBlock,
  BlockType,
} from './ChapterRichContentEditor.types';

/**
 * Initializes blocks from chapter data (content or legacy fields)
 */
function initializeBlocks(chapter: Chapter): EditorBlock[] {
  if (chapter.content && chapter.content.length > 0) {
    return chapter.content;
  }

  // Migration logic: Convert old fields to blocks if content is empty but old fields exist
  if (chapter.introText || chapter.proTips?.length > 0) {
    const newBlocks: EditorBlock[] = [];

    if (chapter.introText) {
      newBlocks.push({
        id: `intro-${Date.now()}`,
        type: 'richText',
        content: chapter.introText,
      });
    }

    if (chapter.proTips && Array.isArray(chapter.proTips)) {
      chapter.proTips.forEach((tip: any, index: number) => {
        newBlocks.push({
          id: `tip-${Date.now()}-${index}`,
          type: 'proTip',
          title: tip.title,
          content: tip.content,
        });
      });
    }

    return newBlocks;
  }

  return [];
}

export function useChapterRichContentEditor(chapter: Chapter) {
  // Track the last chapter ID to know when we're switching chapters
  const lastChapterIdRef = useRef<string>(chapter.id);

  const [blocks, setBlocks] = useState<EditorBlock[]>(() =>
    initializeBlocks(chapter)
  );

  // Track the ID of the last added block for auto-scrolling
  const [lastAddedBlockId, setLastAddedBlockId] = useState<string | null>(null);

  // Only re-initialize blocks when switching to a different chapter (by ID)
  // This prevents the infinite loop caused by parent content prop changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (chapter.id !== lastChapterIdRef.current) {
      lastChapterIdRef.current = chapter.id;
      setBlocks(initializeBlocks(chapter));
    }
  }, [chapter, chapter.id]); // Intentionally only depend on chapter.id to avoid infinite loops

  const addBlock = (type: BlockType): string => {
    const newBlock: EditorBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: '', // Initial content
      title:
        type === 'proTip'
          ? 'Pro Tip'
          : type === 'code'
            ? 'typescript'
            : undefined,
    };
    setBlocks([...blocks, newBlock]);
    setLastAddedBlockId(newBlock.id);
    return newBlock.id;
  };

  // Clear the last added block ID after it's been used for scrolling
  const clearLastAddedBlockId = () => {
    setLastAddedBlockId(null);
  };

  const updateBlock = (
    id: string,
    data: Partial<Omit<EditorBlock, 'id' | 'type'>>
  ) => {
    setBlocks(
      blocks.map((block) => (block.id === id ? { ...block, ...data } : block))
    );
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === blocks.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...blocks];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setBlocks(updated);
  };

  // Image Upload State
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);

  const handleBlockImageUpload = async (
    blockId: string,
    file: File
  ): Promise<void> => {
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploadingBlockId(blockId);

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

      // Update block with new URL
      updateBlock(blockId, { content: data.url });
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingBlockId(null);
    }
  };

  return {
    blocks,
    addBlock,
    updateBlock,
    removeBlock,
    moveBlock,
    handleBlockImageUpload,
    uploadingBlockId,
    lastAddedBlockId,
    clearLastAddedBlockId,
  };
}
