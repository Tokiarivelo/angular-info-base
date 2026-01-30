'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, Loader2, X } from 'lucide-react';
import { EditorBlock } from '../ChapterRichContentEditor.types';

interface BlockAIActionsProps {
  block: EditorBlock;
  onRegeneratedBlock: (newBlock: Partial<EditorBlock>) => void;
}

/**
 * AI action button for regenerating a single block
 */
export function BlockRegenerateButton({
  block,
  onRegeneratedBlock,
}: BlockAIActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegenerate = async (customInstruction?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/block-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'regenerate',
          block: {
            type: block.type,
            content: block.content,
            title: block.title,
          },
          instruction: customInstruction || instruction,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to regenerate');
      }

      onRegeneratedBlock({
        content: data.block.content,
        title: data.block.title,
      });

      setIsOpen(false);
      setInstruction('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show for separator blocks
  if (block.type === 'separator') return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
        title="Regenerate with AI"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-sm text-gray-900 dark:text-white">
                AI Regenerate
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

          <div className="space-y-3">
            {/* Quick actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleRegenerate('Make it more concise')}
                disabled={isLoading}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                More concise
              </button>
              <button
                onClick={() => handleRegenerate('Make it more detailed')}
                disabled={isLoading}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                More detailed
              </button>
              <button
                onClick={() => handleRegenerate('Add a practical example')}
                disabled={isLoading}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Add example
              </button>
            </div>

            <div className="border-t dark:border-gray-700 pt-3">
              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Custom instruction (optional)..."
                rows={2}
                className="w-full text-sm px-2 py-1.5 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
              />
              <button
                onClick={() => handleRegenerate()}
                disabled={isLoading}
                className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Regenerate Block
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ImproveSelectionModalProps {
  selectedText: string;
  onApply: (improvedText: string) => void;
  onClose: () => void;
}

/**
 * Modal for improving selected text with AI
 */
export function ImproveSelectionModal({
  selectedText,
  onApply,
  onClose,
}: ImproveSelectionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImprove = async (customInstruction?: string) => {
    const finalInstruction = customInstruction || instruction;
    if (!finalInstruction.trim()) {
      setError('Please provide an instruction');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/block-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'improve',
          selectedText,
          instruction: finalInstruction,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to improve text');
      }

      setPreview(data.improvedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (preview) {
      onApply(preview);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white">Improve with AI</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Selected text preview */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              Selected text:
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 max-h-24 overflow-y-auto">
              {selectedText.slice(0, 200)}
              {selectedText.length > 200 ? '...' : ''}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
              Quick actions:
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleImprove('Fix grammar and spelling')}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 disabled:opacity-50"
              >
                Fix grammar
              </button>
              <button
                onClick={() => handleImprove('Make it more professional')}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 disabled:opacity-50"
              >
                More professional
              </button>
              <button
                onClick={() => handleImprove('Simplify the language')}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 disabled:opacity-50"
              >
                Simplify
              </button>
              <button
                onClick={() => handleImprove('Expand with more details')}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 disabled:opacity-50"
              >
                Expand
              </button>
            </div>
          </div>

          {/* Custom instruction */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              Custom instruction:
            </label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="How should the AI improve this text?"
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none text-sm"
            />
            <button
              onClick={() => handleImprove()}
              disabled={isLoading || !instruction.trim()}
              className="mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Improve
                </>
              )}
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Preview */}
          {preview && (
            <div className="border-t dark:border-gray-700 pt-4">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                Preview:
              </label>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 max-h-32 overflow-y-auto">
                {preview}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleApply}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
                >
                  Apply Changes
                </button>
                <button
                  onClick={() => setPreview(null)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
