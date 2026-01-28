import { renderHook, act } from '@testing-library/react';
import { useChapterRichContentEditor } from '@/components/admin/ChapterRichContentEditor/ChapterRichContentEditor.hooks';
import {
  Chapter,
  EditorBlock,
} from '@/components/admin/ChapterRichContentEditor/ChapterRichContentEditor.types';

describe('useChapterRichContentEditor', () => {
  const createMockChapter = (overrides: Partial<Chapter> = {}): Chapter => ({
    id: 'chapter-1',
    title: 'Test Chapter',
    content: [],
    ...overrides,
  });

  describe('initialization', () => {
    it('should initialize with empty blocks when chapter has no content', () => {
      const chapter = createMockChapter({ content: [] });
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      expect(result.current.blocks).toEqual([]);
    });

    it('should initialize with chapter content when provided', () => {
      const initialBlocks: EditorBlock[] = [
        { id: 'block-1', type: 'richText', content: 'Hello world' },
      ];
      const chapter = createMockChapter({ content: initialBlocks });
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      expect(result.current.blocks).toEqual(initialBlocks);
    });

    it('should migrate legacy introText to richText block', () => {
      const chapter = createMockChapter({
        content: undefined,
        introText: 'Legacy intro text',
      });
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      expect(result.current.blocks).toHaveLength(1);
      expect(result.current.blocks[0].type).toBe('richText');
      expect(result.current.blocks[0].content).toBe('Legacy intro text');
    });

    it('should migrate legacy proTips to proTip blocks', () => {
      const chapter = createMockChapter({
        content: undefined,
        proTips: [
          { title: 'Tip 1', content: 'Content 1' },
          { title: 'Tip 2', content: 'Content 2' },
        ],
      });
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      expect(result.current.blocks).toHaveLength(2);
      expect(result.current.blocks[0].type).toBe('proTip');
      expect(result.current.blocks[0].title).toBe('Tip 1');
      expect(result.current.blocks[1].type).toBe('proTip');
      expect(result.current.blocks[1].title).toBe('Tip 2');
    });
  });

  describe('block operations', () => {
    it('should add a new block', () => {
      const chapter = createMockChapter();
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      act(() => {
        result.current.addBlock('richText');
      });

      expect(result.current.blocks).toHaveLength(1);
      expect(result.current.blocks[0].type).toBe('richText');
      expect(result.current.blocks[0].content).toBe('');
    });

    it('should update an existing block', () => {
      const initialBlocks: EditorBlock[] = [
        { id: 'block-1', type: 'richText', content: 'Original' },
      ];
      const chapter = createMockChapter({ content: initialBlocks });
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      act(() => {
        result.current.updateBlock('block-1', { content: 'Updated' });
      });

      expect(result.current.blocks[0].content).toBe('Updated');
    });

    it('should remove a block', () => {
      const initialBlocks: EditorBlock[] = [
        { id: 'block-1', type: 'richText', content: 'Block 1' },
        { id: 'block-2', type: 'richText', content: 'Block 2' },
      ];
      const chapter = createMockChapter({ content: initialBlocks });
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      act(() => {
        result.current.removeBlock('block-1');
      });

      expect(result.current.blocks).toHaveLength(1);
      expect(result.current.blocks[0].id).toBe('block-2');
    });

    it('should move a block up', () => {
      const initialBlocks: EditorBlock[] = [
        { id: 'block-1', type: 'richText', content: 'Block 1' },
        { id: 'block-2', type: 'richText', content: 'Block 2' },
      ];
      const chapter = createMockChapter({ content: initialBlocks });
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      act(() => {
        result.current.moveBlock(1, 'up');
      });

      expect(result.current.blocks[0].id).toBe('block-2');
      expect(result.current.blocks[1].id).toBe('block-1');
    });

    it('should move a block down', () => {
      const initialBlocks: EditorBlock[] = [
        { id: 'block-1', type: 'richText', content: 'Block 1' },
        { id: 'block-2', type: 'richText', content: 'Block 2' },
      ];
      const chapter = createMockChapter({ content: initialBlocks });
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      act(() => {
        result.current.moveBlock(0, 'down');
      });

      expect(result.current.blocks[0].id).toBe('block-2');
      expect(result.current.blocks[1].id).toBe('block-1');
    });

    it('should not move the first block up', () => {
      const initialBlocks: EditorBlock[] = [
        { id: 'block-1', type: 'richText', content: 'Block 1' },
        { id: 'block-2', type: 'richText', content: 'Block 2' },
      ];
      const chapter = createMockChapter({ content: initialBlocks });
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      act(() => {
        result.current.moveBlock(0, 'up');
      });

      expect(result.current.blocks[0].id).toBe('block-1');
      expect(result.current.blocks[1].id).toBe('block-2');
    });

    it('should not move the last block down', () => {
      const initialBlocks: EditorBlock[] = [
        { id: 'block-1', type: 'richText', content: 'Block 1' },
        { id: 'block-2', type: 'richText', content: 'Block 2' },
      ];
      const chapter = createMockChapter({ content: initialBlocks });
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      act(() => {
        result.current.moveBlock(1, 'down');
      });

      expect(result.current.blocks[0].id).toBe('block-1');
      expect(result.current.blocks[1].id).toBe('block-2');
    });
  });

  describe('changeBlockType', () => {
    it('should convert richText block to proTip', () => {
      const initialBlocks: EditorBlock[] = [
        { id: 'block-1', type: 'richText', content: 'Some text content' },
      ];
      const chapter = createMockChapter({ content: initialBlocks });
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      let success: boolean;
      act(() => {
        success = result.current.changeBlockType('block-1', 'proTip');
      });

      expect(success!).toBe(true);
      expect(result.current.blocks[0].type).toBe('proTip');
      expect(result.current.blocks[0].title).toBe('Pro Tip');
      expect(result.current.blocks[0].content).toBe('Some text content');
    });

    it('should convert proTip block to richText', () => {
      const initialBlocks: EditorBlock[] = [
        {
          id: 'block-1',
          type: 'proTip',
          content: 'Tip content',
          title: 'Pro Tip',
        },
      ];
      const chapter = createMockChapter({ content: initialBlocks });
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      let success: boolean;
      act(() => {
        success = result.current.changeBlockType('block-1', 'richText');
      });

      expect(success!).toBe(true);
      expect(result.current.blocks[0].type).toBe('richText');
      expect(result.current.blocks[0].title).toBeUndefined();
    });

    it('should preserve custom proTip title as heading when converting to richText', () => {
      const initialBlocks: EditorBlock[] = [
        {
          id: 'block-1',
          type: 'proTip',
          content: 'Tip content',
          title: 'Custom Title',
        },
      ];
      const chapter = createMockChapter({ content: initialBlocks });
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      act(() => {
        result.current.changeBlockType('block-1', 'richText');
      });

      expect(result.current.blocks[0].content).toBe(
        '<h3>Custom Title</h3>Tip content'
      );
    });

    it('should not convert code block to other types', () => {
      const initialBlocks: EditorBlock[] = [
        {
          id: 'block-1',
          type: 'code',
          content: 'console.log("test");',
          title: 'typescript',
        },
      ];
      const chapter = createMockChapter({ content: initialBlocks });
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      let success: boolean;
      act(() => {
        success = result.current.changeBlockType('block-1', 'richText');
      });

      expect(success!).toBe(false);
      expect(result.current.blocks[0].type).toBe('code');
    });

    it('should not convert image block to other types', () => {
      const initialBlocks: EditorBlock[] = [
        {
          id: 'block-1',
          type: 'image',
          content: 'https://example.com/image.png',
        },
      ];
      const chapter = createMockChapter({ content: initialBlocks });
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      let success: boolean;
      act(() => {
        success = result.current.changeBlockType('block-1', 'proTip');
      });

      expect(success!).toBe(false);
      expect(result.current.blocks[0].type).toBe('image');
    });

    it('should return false for non-existent block', () => {
      const chapter = createMockChapter({ content: [] });
      const { result } = renderHook(() => useChapterRichContentEditor(chapter));

      let success: boolean;
      act(() => {
        success = result.current.changeBlockType('non-existent', 'proTip');
      });

      expect(success!).toBe(false);
    });
  });

  describe('infinite loop prevention', () => {
    it('should NOT reset blocks when chapter content prop changes (same chapter)', () => {
      const initialBlocks: EditorBlock[] = [
        { id: 'block-1', type: 'richText', content: 'Original' },
      ];
      const chapter = createMockChapter({ content: initialBlocks });
      const { result, rerender } = renderHook(
        ({ chapter }) => useChapterRichContentEditor(chapter),
        { initialProps: { chapter } }
      );

      // User makes a local change
      act(() => {
        result.current.updateBlock('block-1', { content: 'User Updated' });
      });
      expect(result.current.blocks[0].content).toBe('User Updated');

      // Parent re-renders with updated content prop (simulating the sync cycle)
      const updatedChapter = createMockChapter({
        id: 'chapter-1', // Same chapter ID
        content: [{ id: 'block-1', type: 'richText', content: 'User Updated' }],
      });
      rerender({ chapter: updatedChapter });

      // Blocks should still reflect local state, NOT reset from prop
      expect(result.current.blocks[0].content).toBe('User Updated');
    });

    it('should reset blocks when switching to a different chapter', () => {
      const chapter1Blocks: EditorBlock[] = [
        { id: 'block-1', type: 'richText', content: 'Chapter 1 content' },
      ];
      const chapter1 = createMockChapter({
        id: 'chapter-1',
        content: chapter1Blocks,
      });

      const { result, rerender } = renderHook(
        ({ chapter }) => useChapterRichContentEditor(chapter),
        { initialProps: { chapter: chapter1 } }
      );

      expect(result.current.blocks[0].content).toBe('Chapter 1 content');

      // Switch to a different chapter
      const chapter2Blocks: EditorBlock[] = [
        { id: 'block-2', type: 'richText', content: 'Chapter 2 content' },
      ];
      const chapter2 = createMockChapter({
        id: 'chapter-2',
        content: chapter2Blocks,
      });
      rerender({ chapter: chapter2 });

      // Blocks should now reflect the new chapter
      expect(result.current.blocks).toHaveLength(1);
      expect(result.current.blocks[0].content).toBe('Chapter 2 content');
    });
  });
});
