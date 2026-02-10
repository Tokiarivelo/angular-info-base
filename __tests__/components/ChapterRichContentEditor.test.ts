import { renderHook, act } from '@testing-library/react';
import { useChapterRichContentEditor } from '@/components/admin/ChapterRichContentEditor/ChapterRichContentEditor.hooks';
import {
  Chapter,
  EditorBlock,
} from '@/components/admin/ChapterRichContentEditor/ChapterRichContentEditor.types';

describe('useChapterRichContentEditor', () => {
  const mockChapter: Chapter = {
    id: 'chapter-1',
    title: 'Test Chapter',
    description: 'Test description',
    content: [],
  };

  const mockChapterWithContent: Chapter = {
    id: 'chapter-2',
    title: 'Test Chapter 2',
    description: 'Test description 2',
    content: [
      { id: 'block-1', type: 'richText', content: 'Hello world' },
      {
        id: 'block-2',
        type: 'proTip',
        content: 'Pro tip content',
        title: 'Tip',
      },
    ],
  };

  describe('initialization', () => {
    it('should initialize with empty blocks when chapter has no content', () => {
      const { result } = renderHook(() =>
        useChapterRichContentEditor(mockChapter)
      );

      expect(result.current.blocks).toEqual([]);
    });

    it('should initialize with chapter content when provided', () => {
      const { result } = renderHook(() =>
        useChapterRichContentEditor(mockChapterWithContent)
      );

      expect(result.current.blocks).toHaveLength(2);
      expect(result.current.blocks[0].type).toBe('richText');
      expect(result.current.blocks[1].type).toBe('proTip');
    });

    it('should NOT reinitialize blocks when chapter prop changes but ID stays the same', () => {
      const { result, rerender } = renderHook(
        ({ chapter }) => useChapterRichContentEditor(chapter),
        { initialProps: { chapter: mockChapterWithContent } }
      );

      // Add a block to simulate user changes
      act(() => {
        result.current.addBlock('code');
      });

      const blocksBeforeRerender = result.current.blocks;
      expect(blocksBeforeRerender).toHaveLength(3);

      // Rerender with same ID but different content reference
      // This simulates parent passing back the updated content
      const updatedChapter = {
        ...mockChapterWithContent,
        content: [...mockChapterWithContent.content!],
      };

      rerender({ chapter: updatedChapter });

      // Blocks should NOT be reset - this prevents infinite loops
      expect(result.current.blocks).toHaveLength(3);
      expect(result.current.blocks).toBe(blocksBeforeRerender);
    });

    it('should reinitialize blocks when switching to a different chapter', () => {
      const { result, rerender } = renderHook(
        ({ chapter }) => useChapterRichContentEditor(chapter),
        { initialProps: { chapter: mockChapter } }
      );

      // Add a block
      act(() => {
        result.current.addBlock('richText');
      });

      expect(result.current.blocks).toHaveLength(1);

      // Switch to different chapter
      rerender({ chapter: mockChapterWithContent });

      // Blocks should be reinitialized from new chapter
      expect(result.current.blocks).toHaveLength(2);
    });
  });

  describe('addBlock', () => {
    it('should add a richText block', () => {
      const { result } = renderHook(() =>
        useChapterRichContentEditor(mockChapter)
      );

      let returnedId: string;
      act(() => {
        returnedId = result.current.addBlock('richText');
      });

      expect(result.current.blocks).toHaveLength(1);
      expect(result.current.blocks[0].type).toBe('richText');
      expect(result.current.blocks[0].content).toBe('');
      expect(result.current.lastAddedBlockId).toBe(returnedId!);
    });

    it('should add a proTip block with default title', () => {
      const { result } = renderHook(() =>
        useChapterRichContentEditor(mockChapter)
      );

      act(() => {
        result.current.addBlock('proTip');
      });

      expect(result.current.blocks).toHaveLength(1);
      expect(result.current.blocks[0].type).toBe('proTip');
      expect(result.current.blocks[0].title).toBe('Pro Tip');
      expect(result.current.lastAddedBlockId).toBe(result.current.blocks[0].id);
    });

    it('should add a code block with default language', () => {
      const { result } = renderHook(() =>
        useChapterRichContentEditor(mockChapter)
      );

      act(() => {
        result.current.addBlock('code');
      });

      expect(result.current.blocks).toHaveLength(1);
      expect(result.current.blocks[0].type).toBe('code');
      expect(result.current.blocks[0].title).toBe('typescript');
    });

    it('should insert a block at the beginning with atIndex=0', () => {
      const { result } = renderHook(() =>
        useChapterRichContentEditor(mockChapterWithContent)
      );

      act(() => {
        result.current.addBlock('separator', 0);
      });

      expect(result.current.blocks).toHaveLength(3);
      expect(result.current.blocks[0].type).toBe('separator');
      expect(result.current.blocks[1].id).toBe('block-1');
      expect(result.current.blocks[2].id).toBe('block-2');
    });

    it('should insert a block between existing blocks', () => {
      const { result } = renderHook(() =>
        useChapterRichContentEditor(mockChapterWithContent)
      );

      act(() => {
        result.current.addBlock('image', 1);
      });

      expect(result.current.blocks).toHaveLength(3);
      expect(result.current.blocks[0].id).toBe('block-1');
      expect(result.current.blocks[1].type).toBe('image');
      expect(result.current.blocks[2].id).toBe('block-2');
    });

    it('should append block when no atIndex is specified', () => {
      const { result } = renderHook(() =>
        useChapterRichContentEditor(mockChapterWithContent)
      );

      act(() => {
        result.current.addBlock('code');
      });

      expect(result.current.blocks).toHaveLength(3);
      expect(result.current.blocks[2].type).toBe('code');
    });

    it('should clear lastAddedBlockId when clearLastAddedBlockId is called', () => {
      const { result } = renderHook(() =>
        useChapterRichContentEditor(mockChapter)
      );

      act(() => {
        result.current.addBlock('richText');
      });

      expect(result.current.lastAddedBlockId).not.toBeNull();

      act(() => {
        result.current.clearLastAddedBlockId();
      });

      expect(result.current.lastAddedBlockId).toBeNull();
    });
  });

  describe('updateBlock', () => {
    it('should update block content', () => {
      const { result } = renderHook(() =>
        useChapterRichContentEditor(mockChapterWithContent)
      );

      act(() => {
        result.current.updateBlock('block-1', { content: 'Updated content' });
      });

      expect(result.current.blocks[0].content).toBe('Updated content');
    });

    it('should update block title', () => {
      const { result } = renderHook(() =>
        useChapterRichContentEditor(mockChapterWithContent)
      );

      act(() => {
        result.current.updateBlock('block-2', { title: 'New Title' });
      });

      expect(result.current.blocks[1].title).toBe('New Title');
    });
  });

  describe('removeBlock', () => {
    it('should remove a block by id', () => {
      const { result } = renderHook(() =>
        useChapterRichContentEditor(mockChapterWithContent)
      );

      act(() => {
        result.current.removeBlock('block-1');
      });

      expect(result.current.blocks).toHaveLength(1);
      expect(result.current.blocks[0].id).toBe('block-2');
    });
  });

  describe('moveBlock', () => {
    it('should move block up', () => {
      const { result } = renderHook(() =>
        useChapterRichContentEditor(mockChapterWithContent)
      );

      act(() => {
        result.current.moveBlock(1, 'up');
      });

      expect(result.current.blocks[0].id).toBe('block-2');
      expect(result.current.blocks[1].id).toBe('block-1');
    });

    it('should move block down', () => {
      const { result } = renderHook(() =>
        useChapterRichContentEditor(mockChapterWithContent)
      );

      act(() => {
        result.current.moveBlock(0, 'down');
      });

      expect(result.current.blocks[0].id).toBe('block-2');
      expect(result.current.blocks[1].id).toBe('block-1');
    });

    it('should not move first block up', () => {
      const { result } = renderHook(() =>
        useChapterRichContentEditor(mockChapterWithContent)
      );

      act(() => {
        result.current.moveBlock(0, 'up');
      });

      // Order should remain unchanged
      expect(result.current.blocks[0].id).toBe('block-1');
      expect(result.current.blocks[1].id).toBe('block-2');
    });

    it('should not move last block down', () => {
      const { result } = renderHook(() =>
        useChapterRichContentEditor(mockChapterWithContent)
      );

      act(() => {
        result.current.moveBlock(1, 'down');
      });

      // Order should remain unchanged
      expect(result.current.blocks[0].id).toBe('block-1');
      expect(result.current.blocks[1].id).toBe('block-2');
    });
  });
});
