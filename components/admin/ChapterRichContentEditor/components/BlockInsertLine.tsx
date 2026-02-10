'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  BlockType,
  BLOCK_TYPE_LABELS,
} from '../ChapterRichContentEditor.types';

interface BlockInsertLineProps {
  /** The index at which the new block will be inserted */
  insertAtIndex: number;
  /** Callback to insert a block at a given index */
  onInsertBlock: (type: BlockType, atIndex: number) => void;
}

const BLOCK_OPTIONS: { type: BlockType; icon: string; colorClass: string }[] = [
  {
    type: 'richText',
    icon: '📝',
    colorClass:
      'hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  },
  {
    type: 'proTip',
    icon: '💡',
    colorClass:
      'hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  },
  {
    type: 'image',
    icon: '🖼️',
    colorClass:
      'hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  },
  {
    type: 'code',
    icon: '💻',
    colorClass:
      'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
  },
  {
    type: 'separator',
    icon: '━',
    colorClass:
      'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400',
  },
];

/**
 * An interactive insertion line that appears between blocks on hover.
 * Shows a "+" button centered on a horizontal line. Clicking it reveals
 * a popover with block type options to insert at that position.
 */
export default function BlockInsertLine({
  insertAtIndex,
  onInsertBlock,
}: BlockInsertLineProps) {
  const t = useTranslations('richContentEditor');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    if (!isPopoverOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPopoverOpen]);

  const handleInsert = (type: BlockType) => {
    onInsertBlock(type, insertAtIndex);
    setIsPopoverOpen(false);
  };

  return (
    <div
      className="block-insert-line group/insert relative flex items-center justify-center py-1"
      data-testid={`block-insert-line-${insertAtIndex}`}
    >
      {/* The horizontal line — visible on hover */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-blue-300 dark:bg-blue-600 opacity-0 group-hover/insert:opacity-100 transition-opacity duration-200" />

      {/* The + button — visible on hover or when popover is open */}
      <div className="relative z-10" ref={popoverRef}>
        <button
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          className={`
            flex items-center justify-center
            w-7 h-7 rounded-full
            border-2 border-blue-400 dark:border-blue-500
            bg-white dark:bg-gray-800
            text-blue-500 dark:text-blue-400
            text-lg font-bold leading-none
            shadow-sm
            transition-all duration-200
            hover:bg-blue-500 hover:text-white hover:border-blue-500
            dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600
            hover:scale-110
            ${isPopoverOpen ? 'opacity-100 scale-110 bg-blue-500 dark:bg-blue-600 text-white border-blue-500 dark:border-blue-600' : 'opacity-0 group-hover/insert:opacity-100'}
          `}
          title={t('insertBlock')}
          aria-label={t('insertBlock')}
        >
          +
        </button>

        {/* Popover with block type options */}
        {isPopoverOpen && (
          <div
            className="
              absolute left-1/2 -translate-x-1/2 top-full mt-2
              bg-white dark:bg-gray-800
              rounded-xl shadow-xl
              border border-gray-200 dark:border-gray-700
              py-2 px-1
              z-50
              min-w-[180px]
              animate-in fade-in slide-in-from-top-1 duration-150
            "
          >
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {t('insertBlockTitle')}
            </div>
            {BLOCK_OPTIONS.map(({ type, icon, colorClass }) => (
              <button
                key={type}
                onClick={() => handleInsert(type)}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2
                  text-sm font-medium rounded-lg
                  transition-colors duration-150
                  ${colorClass}
                `}
                data-testid={`insert-${type}-at-${insertAtIndex}`}
              >
                <span className="text-base">{icon}</span>
                <span>{BLOCK_TYPE_LABELS[type]}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
