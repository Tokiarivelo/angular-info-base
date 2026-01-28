'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  ChapterRichContentEditorProps,
  BlockType,
} from './ChapterRichContentEditor.types';
import { useChapterRichContentEditor } from './ChapterRichContentEditor.hooks';
import ImageBlockEditor from './components/ImageBlockEditor';
import CodeBlockEditor from './components/CodeBlockEditor';
import BlockTypeSelector from './components/BlockTypeSelector';

// Dynamic import to avoid SSR issues with CKEditor
const RichTextEditor = dynamic(() => import('./components/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
  ),
});

export default function ChapterRichContentEditor({
  chapter,
  onSave,
}: ChapterRichContentEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  // Track if initial sync has been skipped to avoid infinite loops
  const hasInitializedRef = useRef(false);
  const blocksVersionRef = useRef(0);

  const {
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
  } = useChapterRichContentEditor(chapter);

  // Auto-scroll to newly added block
  useEffect(() => {
    if (lastAddedBlockId) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        const element = document.querySelector(
          `[data-block-id="${lastAddedBlockId}"]`
        );
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        clearLastAddedBlockId();
      });
    }
  }, [lastAddedBlockId, clearLastAddedBlockId]);

  // Auto-save changes to parent component - but only after user makes changes
  const syncToParent = useCallback(
    (currentBlocks: any[]) => {
      onSave({
        content: currentBlocks,
      });
    },
    [onSave]
  );

  // Auto-sync blocks to parent whenever they change - but skip initial render
  useEffect(() => {
    // Skip the first render to avoid syncing initial state back to parent
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }
    syncToParent(blocks);
  }, [blocks, syncToParent]);

  const handleUpdateBlock = (id: string, data: any) => {
    updateBlock(id, data);
    // The useEffect above will handle syncing to parent
  };

  // Whenever blocks structure changes (add/remove/move), sync
  // We can't do this easily inside the hook actions without passing the callback,
  // so we'll wrap the actions here or use an effect.
  // Using effect on blocks might be too chatty if it runs on every keystroke driven update,
  // but since local state drives the editor, maybe it's fine.
  // Actually, let's just sync when struct actions happen.

  return (
    <div className="space-y-8 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
      <div className="flex justify-between items-center border-b dark:border-gray-700 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Rich Content Editor
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => addBlock('richText')}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            + Text
          </button>
          <button
            onClick={() => addBlock('proTip')}
            className="px-3 py-1 bg-amber-600 text-white text-sm rounded-md hover:bg-amber-700 font-medium transition-colors"
          >
            + Pro Tip
          </button>
          <button
            onClick={() => addBlock('image')}
            className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 font-medium transition-colors"
          >
            + Image
          </button>
          <button
            onClick={() => addBlock('code')}
            className="px-3 py-1 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-600 font-medium transition-colors"
          >
            + Code
          </button>
          <button
            onClick={() => addBlock('separator')}
            className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-400 font-medium transition-colors"
          >
            + Separator
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            data-block-id={block.id}
            className="flex gap-3 group"
          >
            {/* Block Controls - Outside content block */}
            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-2">
              <button
                onClick={() => {
                  moveBlock(index, 'up');
                }}
                disabled={index === 0}
                className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-600 dark:text-gray-300"
                title="Move Up"
              >
                ↑
              </button>
              <button
                onClick={() => moveBlock(index, 'down')}
                disabled={index === blocks.length - 1}
                className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-600 dark:text-gray-300"
                title="Move Down"
              >
                ↓
              </button>
              <button
                onClick={() => removeBlock(block.id)}
                className="p-1 bg-red-100 dark:bg-red-900/30 text-red-600 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                title="Remove Block"
              >
                ✕
              </button>
              {/* Block Type Selector - Only shows for convertible types */}
              <BlockTypeSelector
                currentType={block.type}
                onChangeType={(newType) => changeBlockType(block.id, newType)}
              />
            </div>

            {/* Block Content */}
            <div
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                block.type === 'proTip'
                  ? 'border-amber-100 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/10'
                  : block.type === 'image'
                    ? 'border-purple-100 dark:border-purple-900/30 bg-purple-50 dark:bg-purple-950/10'
                    : block.type === 'code'
                      ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                      : 'border-transparent hover:border-gray-100 dark:hover:border-gray-800'
              }`}
            >
              <div className="space-y-3">
                {block.type === 'proTip' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-1 bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-100 rounded uppercase">
                      Pro Tip
                    </span>
                    <input
                      type="text"
                      value={block.title || ''}
                      onChange={(e) =>
                        handleUpdateBlock(block.id, { title: e.target.value })
                      }
                      placeholder="Tip Title..."
                      className="flex-1 bg-transparent border-b border-amber-300 dark:border-amber-800 focus:border-amber-500 outline-none px-2 py-1 font-semibold text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                {block.type === 'image' && (
                  <ImageBlockEditor
                    blockId={block.id}
                    content={block.content}
                    onUpdate={handleUpdateBlock}
                    onUpload={handleBlockImageUpload}
                    isUploading={uploadingBlockId === block.id}
                  />
                )}

                {block.type === 'code' && (
                  <CodeBlockEditor
                    blockId={block.id}
                    content={block.content}
                    language={block.title || 'typescript'}
                    onUpdate={handleUpdateBlock}
                  />
                )}

                {block.type === 'separator' && (
                  <div className="py-4">
                    <hr className="border-t-2 border-gray-300 dark:border-gray-600" />
                    <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
                      Horizontal Line Separator
                    </p>
                  </div>
                )}

                {block.type === 'richText' || block.type === 'proTip' ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <RichTextEditor
                      data={block.content}
                      onChange={(data) =>
                        handleUpdateBlock(block.id, { content: data })
                      }
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}

        {blocks.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <p>Start by adding content blocks above</p>
          </div>
        )}
      </div>
    </div>
  );
}
