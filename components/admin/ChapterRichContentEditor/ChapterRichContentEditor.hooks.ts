import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Chapter,
  EditorBlock,
  BlockType,
  BLOCK_TYPE_CONVERSIONS,
} from './ChapterRichContentEditor.types';

/**
 * Initializes blocks from chapter data (content or legacy fields)
 */
function initializeBlocks(chapter: Chapter): EditorBlock[] {
  if (chapter.content && chapter.content.length > 0) {
    return chapter.content;
  }

  // Migration logic: Convert old fields to blocks if content is empty but old fields exist
  if (chapter.introText || (chapter.proTips && chapter.proTips.length > 0)) {
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
  }, [chapter.id]); // ONLY depend on ID, not the whole chapter object

  const addBlock = useCallback((type: BlockType, atIndex?: number): string => {
    const newId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newBlock: EditorBlock = {
      id: newId,
      type,
      content: '', // Initial content
      title:
        type === 'proTip'
          ? 'Pro Tip'
          : type === 'code'
            ? 'typescript'
            : undefined,
    };

    setBlocks((prev) => {
      if (atIndex !== undefined && atIndex >= 0 && atIndex <= prev.length) {
        const updated = [...prev];
        updated.splice(atIndex, 0, newBlock);
        return updated;
      }
      return [...prev, newBlock];
    });

    setLastAddedBlockId(newId);
    return newId;
  }, []);

  // Clear the last added block ID after it's been used for scrolling
  const clearLastAddedBlockId = useCallback(() => {
    setLastAddedBlockId(null);
  }, []);

  const updateBlock = useCallback(
    (id: string, data: Partial<Omit<EditorBlock, 'id' | 'type'>>) => {
      setBlocks((prev) =>
        prev.map((block) => (block.id === id ? { ...block, ...data } : block))
      );
    },
    []
  );

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
  }, []);

  const moveBlock = useCallback((index: number, direction: 'up' | 'down') => {
    setBlocks((prev) => {
      if (
        (direction === 'up' && index === 0) ||
        (direction === 'down' && index === prev.length - 1)
      ) {
        return prev;
      }

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const updated = [...prev];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return updated;
    });
  }, []);

  /**
   * Change the type of a block to another compatible type.
   * @param id - The block ID to change
   * @param newType - The new type to change to
   * @returns true if successful, false otherwise
   */
  const changeBlockType = useCallback((id: string, newType: BlockType): boolean => {
    let success = false;
    setBlocks((prev) => {
      const blockIndex = prev.findIndex((b) => b.id === id);
      if (blockIndex === -1) {
        success = false;
        return prev;
      }

      const block = prev[blockIndex];
      const allowedTypes = BLOCK_TYPE_CONVERSIONS[block.type];

      if (!allowedTypes.includes(newType)) {
        console.warn(
          `Cannot convert block type from ${block.type} to ${newType}`
        );
        success = false;
        return prev;
      }

      // Create the new block with converted type
      const newBlock: EditorBlock = {
        ...block,
        type: newType,
      };

      // Handle special conversion logic
      if (block.type === 'richText' && newType === 'proTip') {
        newBlock.title = 'Pro Tip';
      } else if (block.type === 'proTip' && newType === 'richText') {
        if (block.title && block.title !== 'Pro Tip') {
          newBlock.content = `<h3>${block.title}</h3>${block.content}`;
        }
        delete newBlock.title;
      }

      const updated = [...prev];
      updated[blockIndex] = newBlock;
      success = true;
      return updated;
    });
    return success;
  }, []);

  // Image Upload State
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);

  const handleBlockImageUpload = useCallback(
    async (blockId: string, file: File): Promise<void> => {
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

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
    },
    [updateBlock]
  );

  return {
    blocks,
    addBlock,
    updateBlock,
    removeBlock,
    moveBlock,
    changeBlockType,
    handleBlockImageUpload,
    uploadingBlockId,
    lastAddedBlockId,
    clearLastAddedBlockId,
  };
}

