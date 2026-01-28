'use client';

import { useState, useRef, useEffect } from 'react';
import {
  BlockType,
  BLOCK_TYPE_CONVERSIONS,
  BLOCK_TYPE_LABELS,
} from '../ChapterRichContentEditor.types';

interface BlockTypeSelectorProps {
  currentType: BlockType;
  onChangeType: (newType: BlockType) => void;
}

/**
 * A dropdown selector that allows users to change block types
 * Only shows options for types that the current block can convert to
 */
export default function BlockTypeSelector({
  currentType,
  onChangeType,
}: BlockTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableTypes = BLOCK_TYPE_CONVERSIONS[currentType];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Don't render if no conversions are available
  if (availableTypes.length === 0) {
    return null;
  }

  const handleSelect = (type: BlockType) => {
    onChangeType(type);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium flex items-center gap-1"
        title={`Convert to another type`}
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
        <span className="hidden sm:inline">Convert</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <div className="py-1">
            <div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
              Convert to:
            </div>
            {availableTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleSelect(type)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {BLOCK_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
