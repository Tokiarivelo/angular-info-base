'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import {
  Sparkles,
  Send,
  X,
  Trash2,
  Check,
  Loader2,
  FileText,
  ImageIcon,
  Type,
  Globe,
} from 'lucide-react';
import {
  AIChapterChatProps,
  getPromptSuggestions,
  GeneratedChapterData,
  CourseContext,
} from './AIChapterChat.types';
import { useAIChapterChat } from './AIChapterChat.hooks';
import { useTranslations } from 'next-intl';

// Content language options
const CONTENT_LANGUAGES = [
  { value: 'en' as const, label: 'English', flag: '🇺🇸' },
  { value: 'fr' as const, label: 'Français', flag: '🇫🇷' },
];

export default function AIChapterChat({
  onApplyBlocks,
  onApplyChapter,
  onClose,
  courseContext: initialCourseContext,
}: AIChapterChatProps) {
  const t = useTranslations('ai');
  const tCommon = useTranslations('common');

  // Content language state
  const [contentLanguage, setContentLanguage] = useState<'en' | 'fr'>(
    initialCourseContext?.contentLanguage || 'en'
  );

  // Create course context with selected content language
  const courseContext: CourseContext | undefined = useMemo(() => {
    if (!initialCourseContext) return undefined;
    return {
      ...initialCourseContext,
      contentLanguage,
    };
  }, [initialCourseContext, contentLanguage]);

  const {
    messages,
    isLoading,
    error,
    inputValue,
    setInputValue,
    sendMessage,
    clearChat,
  } = useAIChapterChat({ courseContext });

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Generate dynamic prompt suggestions based on course context
  const promptSuggestions = useMemo(
    () => getPromptSuggestions(courseContext),
    [courseContext]
  );

  // Get display name for the course
  const courseName = courseContext?.title || 'your topic';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleApplyBlocks = (blocks: any[]) => {
    onApplyBlocks(blocks);
  };

  const handleApplyAll = async (message: any) => {
    if (!onApplyChapter || !message.blocks) return;

    setIsGeneratingImage(true);

    try {
      let imageUrl: string | undefined;

      // If there's an image prompt, try to generate an image
      if (message.imagePrompt) {
        try {
          const imageResponse = await fetch('/api/ai/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: message.imagePrompt }),
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            imageUrl = imageData.url;
          }
        } catch (imgError) {
          console.error('Failed to generate image:', imgError);
          // Continue without image
        }
      }

      const chapterData: GeneratedChapterData = {
        title: message.chapterTitle,
        description: message.chapterDescription,
        imageUrl,
        blocks: message.blocks,
      };

      onApplyChapter(chapterData);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const selectedLang = CONTENT_LANGUAGES.find(
    (l) => l.value === contentLanguage
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{t('title')}</h2>
              <p className="text-xs text-white/80">
                {courseContext?.title
                  ? t('generatingFor', { courseName: courseContext.title })
                  : t('subtitle')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Content Language Selector */}
            <div className="relative group">
              <button
                className="flex items-center gap-1.5 px-2 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm"
                title={t('contentLanguage')}
              >
                <Globe className="w-4 h-4" />
                <span>{selectedLang?.flag}</span>
              </button>
              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                {CONTENT_LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => setContentLanguage(lang.value)}
                    className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      contentLanguage === lang.value
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                    {contentLanguage === lang.value && (
                      <Check className="w-3 h-3 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title={t('clearChat')}
              >
                <Trash2 className="w-5 h-5 text-white" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('generateComplete')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 max-w-md">
                {t('generateDescription', { topic: courseName })}
              </p>

              {/* Language indicator */}
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                <Globe className="w-3 h-3" />
                <span>
                  {t('generateInLanguage', {
                    language: selectedLang?.label || 'English',
                  })}
                </span>
              </div>

              {/* Quick Prompts */}
              <div className="w-full">
                <p className="text-xs text-gray-400 mb-2">
                  {t('quickSuggestions')}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {promptSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.label}
                      onClick={() => sendMessage(suggestion.prompt)}
                      disabled={isLoading}
                      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 transition-colors disabled:opacity-50"
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">
                          {t('generatingChapter')}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm">
                          {message.role === 'assistant' && message.blocks ? (
                            <div className="space-y-3">
                              {/* Chapter Metadata */}
                              {(message.chapterTitle ||
                                message.chapterDescription) && (
                                <div className="space-y-2 pb-3 border-b border-gray-200 dark:border-gray-700">
                                  {message.chapterTitle && (
                                    <div className="flex items-start gap-2">
                                      <Type className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {t('chapterTitle')}
                                        </span>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                          {message.chapterTitle}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {message.chapterDescription && (
                                    <div className="flex items-start gap-2">
                                      <FileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {t('chapterDescription')}
                                        </span>
                                        <p className="text-gray-700 dark:text-gray-300">
                                          {message.chapterDescription}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {message.imagePrompt && (
                                    <div className="flex items-start gap-2">
                                      <ImageIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {t('coverImagePrompt')}
                                        </span>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                          {message.imagePrompt.slice(0, 100)}...
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Content Blocks Preview */}
                              <p className="text-gray-600 dark:text-gray-300">
                                ✨{' '}
                                {t('generatedBlocks', {
                                  count: message.blocks.length,
                                })}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {message.blocks
                                  .slice(0, 5)
                                  .map((block, idx) => (
                                    <span
                                      key={idx}
                                      className={`px-2 py-1 text-xs rounded ${
                                        block.type === 'proTip'
                                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
                                          : block.type === 'code'
                                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                                      }`}
                                    >
                                      {block.type}
                                    </span>
                                  ))}
                                {message.blocks.length > 5 && (
                                  <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded">
                                    +{message.blocks.length - 5} more
                                  </span>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-2 mt-3">
                                <button
                                  onClick={() =>
                                    handleApplyBlocks(message.blocks!)
                                  }
                                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                  <FileText className="w-4 h-4" />
                                  {t('applyContentOnly')}
                                </button>
                                {onApplyChapter &&
                                  (message.chapterTitle ||
                                    message.chapterDescription) && (
                                    <button
                                      onClick={() => handleApplyAll(message)}
                                      disabled={isGeneratingImage}
                                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                                    >
                                      {isGeneratingImage ? (
                                        <>
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                          {t('generatingImage')}
                                        </>
                                      ) : (
                                        <>
                                          <Check className="w-4 h-4" />
                                          {t('applyAll')}
                                        </>
                                      )}
                                    </button>
                                  )}
                              </div>
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap">
                              {message.content.slice(0, 500) +
                                (message.content.length > 500 ? '...' : '')}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t dark:border-gray-700"
        >
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('placeholder', { topic: courseName })}
              rows={2}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl transition-colors disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400 text-center">
            {t('pressEnter')}
          </p>
        </form>
      </div>
    </div>
  );
}
