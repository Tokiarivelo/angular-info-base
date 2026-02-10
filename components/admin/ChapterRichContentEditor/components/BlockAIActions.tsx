'use client';

import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Loader2, X, Bot, Check } from 'lucide-react';
import { EditorBlock } from '../ChapterRichContentEditor.types';
import { useTranslations } from 'next-intl';
import { AVAILABLE_MODELS, DEFAULT_MODEL } from '@/lib/ai/constants';

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
  const t = useTranslations('ai');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [availableModels, setAvailableModels] = useState(AVAILABLE_MODELS);
  const [showModelSelector, setShowModelSelector] = useState(false);

  // Fetch available models on mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/ai/models');
        if (response.ok) {
          const models = await response.json();
          if (Array.isArray(models) && models.length > 0) {
            setAvailableModels(models);
          }
        }
      } catch (error) {
        console.error('Failed to fetch AI models:', error);
      }
    };
    if (isOpen) {
      fetchModels();
    }
  }, [isOpen]);

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
          model: selectedModel,
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

  const currentModelName =
    availableModels.find((m) => m.id === selectedModel)?.name || selectedModel;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
        title={t('regenerateWithAI') || 'Regenerate with AI'}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-sm text-gray-900 dark:text-white">
                {t('aiRegenerate') || 'AI Regenerate'}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Model Selector */}
          <div className="mb-3">
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                  {currentModelName}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {t('selectModel') || 'Model'}
              </span>
            </button>

            {showModelSelector && (
              <div className="mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                {availableModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id);
                      setShowModelSelector(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      selectedModel === model.id
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="flex-1 truncate">{model.name}</span>
                    {selectedModel === model.id && (
                      <Check className="w-3 h-3 ml-auto text-purple-600 dark:text-purple-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

          <div className="space-y-3">
            {/* Quick actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  handleRegenerate(t('makeConcise') || 'Make it more concise')
                }
                disabled={isLoading}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                {t('moreConcise') || 'More concise'}
              </button>
              <button
                onClick={() =>
                  handleRegenerate(t('makeDetailed') || 'Make it more detailed')
                }
                disabled={isLoading}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                {t('moreDetailed') || 'More detailed'}
              </button>
              <button
                onClick={() =>
                  handleRegenerate(t('addExample') || 'Add a practical example')
                }
                disabled={isLoading}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                {t('addExample') || 'Add example'}
              </button>
            </div>

            <div className="border-t dark:border-gray-700 pt-3">
              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder={
                  t('customInstruction') || 'Custom instruction (optional)...'
                }
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
                    {t('regenerating') || 'Regenerating...'}
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    {t('regenerateBlock') || 'Regenerate Block'}
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
  const t = useTranslations('ai');
  const [isLoading, setIsLoading] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [availableModels, setAvailableModels] = useState(AVAILABLE_MODELS);
  const [showModelSelector, setShowModelSelector] = useState(false);

  // Fetch available models on mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/ai/models');
        if (response.ok) {
          const models = await response.json();
          if (Array.isArray(models) && models.length > 0) {
            setAvailableModels(models);
          }
        }
      } catch (error) {
        console.error('Failed to fetch AI models:', error);
      }
    };
    fetchModels();
  }, []);

  const handleImprove = async (customInstruction?: string) => {
    const finalInstruction = customInstruction || instruction;
    if (!finalInstruction.trim()) {
      setError(t('provideInstruction') || 'Please provide an instruction');
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
          model: selectedModel,
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

  const currentModelName =
    availableModels.find((m) => m.id === selectedModel)?.name || selectedModel;

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white">
              {t('improveWithAI') || 'Improve with AI'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Model Selector */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
              {t('aiModel') || 'AI Model'}:
            </label>
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {currentModelName}
                </span>
              </div>
            </button>

            {showModelSelector && (
              <div className="mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                {availableModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id);
                      setShowModelSelector(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      selectedModel === model.id
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="flex-1 truncate">{model.name}</span>
                    {selectedModel === model.id && (
                      <Check className="w-3 h-3 ml-auto text-purple-600 dark:text-purple-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected text preview */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              {t('selectedText') || 'Selected text'}:
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 max-h-24 overflow-y-auto">
              {selectedText.slice(0, 200)}
              {selectedText.length > 200 ? '...' : ''}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
              {t('quickActions') || 'Quick actions'}:
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  handleImprove(t('fixGrammar') || 'Fix grammar and spelling')
                }
                disabled={isLoading}
                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 disabled:opacity-50"
              >
                {t('fixGrammar') || 'Fix grammar'}
              </button>
              <button
                onClick={() =>
                  handleImprove(
                    t('moreProfessional') || 'Make it more professional'
                  )
                }
                disabled={isLoading}
                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 disabled:opacity-50"
              >
                {t('moreProfessional') || 'More professional'}
              </button>
              <button
                onClick={() =>
                  handleImprove(t('simplify') || 'Simplify the language')
                }
                disabled={isLoading}
                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 disabled:opacity-50"
              >
                {t('simplify') || 'Simplify'}
              </button>
              <button
                onClick={() =>
                  handleImprove(t('expand') || 'Expand with more details')
                }
                disabled={isLoading}
                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 disabled:opacity-50"
              >
                {t('expand') || 'Expand'}
              </button>
            </div>
          </div>

          {/* Custom instruction */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              {t('customInstruction') || 'Custom instruction'}:
            </label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder={
                t('howToImprove') || 'How should the AI improve this text?'
              }
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
                  {t('processing') || 'Processing...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {t('improve') || 'Improve'}
                </>
              )}
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Preview */}
          {preview && (
            <div className="border-t dark:border-gray-700 pt-4">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                {t('preview') || 'Preview'}:
              </label>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 max-h-32 overflow-y-auto">
                {preview}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleApply}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
                >
                  {t('applyChanges') || 'Apply Changes'}
                </button>
                <button
                  onClick={() => setPreview(null)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {t('cancel') || 'Cancel'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
