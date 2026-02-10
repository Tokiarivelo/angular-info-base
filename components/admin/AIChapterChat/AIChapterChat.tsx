'use client';

import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  Bot,
  History,
  Plus,
  MessageSquare,
  ChevronLeft,
} from 'lucide-react';
import {
  AIChapterChatProps,
  getPromptSuggestions,
  GeneratedChapterData,
  CourseContext,
} from './AIChapterChat.types';
import { useAIChapterChat } from './AIChapterChat.hooks';
import { useTranslations } from 'next-intl';
import { AVAILABLE_MODELS } from '@/lib/ai/constants';

// Content language options
const CONTENT_LANGUAGES = [
  { value: 'en' as const, label: 'English', flag: '🇺🇸' },
  { value: 'fr' as const, label: 'Français', flag: '🇫🇷' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Header bar – always sticky at top */
function ChatHeader({
  showHistory,
  setShowHistory,
  sessions,
  courseContext,
  availableModels,
  selectedModel,
  setSelectedModel,
  contentLanguage,
  setContentLanguage,
  messages,
  deleteCurrentSession,
  handleNewChat,
  onClose,
  t,
}: {
  showHistory: boolean;
  setShowHistory: (v: boolean) => void;
  sessions: any[];
  courseContext?: CourseContext;
  availableModels: typeof AVAILABLE_MODELS;
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  contentLanguage: 'en' | 'fr';
  setContentLanguage: (l: 'en' | 'fr') => void;
  messages: any[];
  deleteCurrentSession: () => void;
  handleNewChat: () => void;
  onClose: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const selectedLang = CONTENT_LANGUAGES.find(
    (l) => l.value === contentLanguage
  );

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 flex-shrink-0">
      {/* Left: icon + title */}
      <div className="flex items-center gap-2 min-w-0">
        {showHistory ? (
          <button
            onClick={() => setShowHistory(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            aria-label="Back to chat"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        ) : (
          <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-white truncate">
            {showHistory ? t('chatHistory') || 'Chat History' : t('title')}
          </h2>
          <p className="text-xs text-white/80 truncate">
            {showHistory
              ? `${sessions.length} ${t('sessions') || 'sessions'}`
              : courseContext?.title
                ? t('generatingFor', { courseName: courseContext.title })
                : t('subtitle')}
          </p>
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {!showHistory && (
          <>
            {/* History */}
            <button
              onClick={() => setShowHistory(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title={t('chatHistory') || 'Chat History'}
            >
              <History className="w-5 h-5 text-white" />
            </button>

            {/* New Chat */}
            <button
              onClick={handleNewChat}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title={t('newChat') || 'New Chat'}
            >
              <Plus className="w-5 h-5 text-white" />
            </button>

            {/* Model Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowModelDropdown(!showModelDropdown);
                  setShowLangDropdown(false);
                }}
                className="flex items-center gap-1.5 px-2 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm"
                title={t('selectModel') || 'Select AI Model'}
              >
                <Bot className="w-4 h-4" />
                <span className="max-w-[80px] truncate hidden sm:inline">
                  {availableModels.find((m) => m.id === selectedModel)?.name ||
                    selectedModel}
                </span>
              </button>
              {showModelDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-[70]"
                    onClick={() => setShowModelDropdown(false)}
                  />
                  <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[80] overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-400 flex-shrink-0">
                      {t('selectModel') || 'Select AI Model'}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {availableModels.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model.id);
                            setShowModelDropdown(false);
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
                  </div>
                </>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLangDropdown(!showLangDropdown);
                  setShowModelDropdown(false);
                }}
                className="flex items-center gap-1.5 px-2 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm"
                title={t('contentLanguage')}
              >
                <Globe className="w-4 h-4" />
                <span>{selectedLang?.flag}</span>
              </button>
              {showLangDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-[70]"
                    onClick={() => setShowLangDropdown(false)}
                  />
                  <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[80] overflow-hidden">
                    {CONTENT_LANGUAGES.map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => {
                          setContentLanguage(lang.value);
                          setShowLangDropdown(false);
                        }}
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
                </>
              )}
            </div>

            {/* Delete Chat */}
            {messages.length > 0 && (
              <button
                onClick={deleteCurrentSession}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title={t('deleteChat') || 'Delete Chat'}
              >
                <Trash2 className="w-5 h-5 text-white" />
              </button>
            )}
          </>
        )}

        {/* Close – always visible */}
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors ml-1"
          aria-label="Close AI Chat"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}

/** Empty state shown when no messages */
function EmptyState({
  courseName,
  contentLanguage,
  promptSuggestions,
  isLoading,
  sendMessage,
  selectedModel,
  t,
}: {
  courseName: string;
  contentLanguage: 'en' | 'fr';
  promptSuggestions: ReturnType<typeof getPromptSuggestions>;
  isLoading: boolean;
  sendMessage: (p: string, m: string) => void;
  selectedModel: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const selectedLang = CONTENT_LANGUAGES.find(
    (l) => l.value === contentLanguage
  );

  return (
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

      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Globe className="w-3 h-3" />
        <span>
          {t('generateInLanguage', {
            language: selectedLang?.label || 'English',
          })}
        </span>
      </div>

      <div className="w-full">
        <p className="text-xs text-gray-400 mb-2">{t('quickSuggestions')}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {promptSuggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              onClick={() => sendMessage(suggestion.prompt, selectedModel)}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 transition-colors disabled:opacity-50"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Single message bubble */
function MessageBubble({
  message,
  onApplyBlocks,
  onApplyAll,
  isGeneratingImage,
  t,
}: {
  message: any;
  onApplyBlocks: (blocks: any[]) => void;
  onApplyAll: (msg: any) => void;
  isGeneratingImage: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div
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
            <span className="text-sm">{t('generatingChapter')}</span>
          </div>
        ) : (
          <div className="text-sm">
            {message.role === 'assistant' && message.blocks ? (
              <div className="space-y-3">
                {/* Chapter Metadata */}
                {(message.chapterTitle || message.chapterDescription) && (
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
                  ✨ {t('generatedBlocks', { count: message.blocks.length })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {message.blocks.slice(0, 5).map((block: any, idx: number) => (
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
                    onClick={() => onApplyBlocks(message.blocks)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    {t('applyContentOnly')}
                  </button>
                  {(message.chapterTitle || message.chapterDescription) && (
                    <button
                      onClick={() => onApplyAll(message)}
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
        )}
      </div>
    </div>
  );
}

/** History panel */
function HistoryPanel({
  sessions,
  currentSessionId,
  onLoadSession,
  onNewChat,
  formatSessionDate,
  t,
}: {
  sessions: any[];
  currentSessionId: string | null;
  onLoadSession: (id: string) => void;
  onNewChat: () => void;
  formatSessionDate: (d: Date | string) => string;
  t: ReturnType<typeof useTranslations>;
}) {
  if (sessions.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t('noSessions') || 'No chat history'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {t('noSessionsDesc') || 'Start a new chat to see your history here.'}
        </p>
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('newChat') || 'New Chat'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sessions.map((session) => (
        <button
          key={session.id}
          onClick={() => onLoadSession(session.id)}
          className={`w-full p-4 rounded-lg text-left transition-colors ${
            currentSessionId === session.id
              ? 'bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-300 dark:border-purple-700'
              : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                {session.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatSessionDate(session.updatedAt)} •{' '}
                {session.messages?.length || 0} {t('messages') || 'messages'}
              </p>
            </div>
            <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AIChapterChat({
  onApplyBlocks,
  onApplyChapter,
  onClose,
  courseContext: initialCourseContext,
}: AIChapterChatProps) {
  const t = useTranslations('ai');

  const [showHistory, setShowHistory] = useState(false);
  const [availableModels, setAvailableModels] = useState(AVAILABLE_MODELS);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Portal mount
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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

  // Course context
  const courseContext: CourseContext | undefined = useMemo(() => {
    if (!initialCourseContext) return undefined;
    return { ...initialCourseContext };
  }, [initialCourseContext]);

  const {
    messages,
    isLoading,
    error,
    inputValue,
    setInputValue,
    sendMessage,
    clearChat,
    currentSession,
    sessions,
    loadSession,
    startNewChat,
    deleteCurrentSession,
    selectedModel,
    setSelectedModel,
    contentLanguage,
    setContentLanguage,
  } = useAIChapterChat({
    courseContext,
    courseId: initialCourseContext?.courseId,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const promptSuggestions = useMemo(
    () => getPromptSuggestions(courseContext),
    [courseContext]
  );

  const courseName = courseContext?.title || 'your topic';

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input
  useEffect(() => {
    if (!showHistory) {
      inputRef.current?.focus();
    }
  }, [showHistory]);

  // Escape to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue.trim() && !isLoading) {
        sendMessage(inputValue, selectedModel);
      }
    },
    [inputValue, isLoading, sendMessage, selectedModel]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const handleApplyBlocks = useCallback(
    (blocks: any[]) => {
      onApplyBlocks(blocks);
    },
    [onApplyBlocks]
  );

  const handleApplyAll = useCallback(
    async (message: any) => {
      if (!onApplyChapter || !message.blocks) return;

      setIsGeneratingImage(true);

      try {
        let imageUrl: string | undefined;

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
    },
    [onApplyChapter]
  );

  const handleLoadSession = useCallback(
    async (sessionId: string) => {
      await loadSession(sessionId);
      setShowHistory(false);
    },
    [loadSession]
  );

  const handleNewChat = useCallback(async () => {
    await startNewChat();
    setShowHistory(false);
  }, [startNewChat]);

  const formatSessionDate = useCallback(
    (date: Date | string) => {
      const d = new Date(date);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) return t('today') || 'Today';
      if (days === 1) return t('yesterday') || 'Yesterday';
      if (days < 7) return `${days} ${t('daysAgo') || 'days ago'}`;
      return d.toLocaleDateString();
    },
    [t]
  );

  // ─── Render via portal so we sit above everything ───
  const chatUI = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="AI Chat"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col h-[80vh] min-h-[600px] overflow-hidden">
        {/* Header – sticky */}
        <ChatHeader
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          sessions={sessions}
          courseContext={courseContext}
          availableModels={availableModels}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          contentLanguage={contentLanguage}
          setContentLanguage={setContentLanguage}
          messages={messages}
          deleteCurrentSession={deleteCurrentSession}
          handleNewChat={handleNewChat}
          onClose={onClose}
          t={t}
        />

        {/* Body: either history OR chat */}
        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-4">
            <HistoryPanel
              sessions={sessions}
              currentSessionId={currentSession?.id || null}
              onLoadSession={handleLoadSession}
              onNewChat={handleNewChat}
              formatSessionDate={formatSessionDate}
              t={t}
            />
          </div>
        ) : (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.length === 0 ? (
                <EmptyState
                  courseName={courseName}
                  contentLanguage={contentLanguage}
                  promptSuggestions={promptSuggestions}
                  isLoading={isLoading}
                  sendMessage={sendMessage}
                  selectedModel={selectedModel}
                  t={t}
                />
              ) : (
                <>
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      onApplyBlocks={handleApplyBlocks}
                      onApplyAll={handleApplyAll}
                      isGeneratingImage={isGeneratingImage}
                      t={t}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 flex-shrink-0">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Input Area – sticky at bottom */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900"
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
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl transition-colors disabled:cursor-not-allowed self-end"
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
          </>
        )}
      </div>
    </div>
  );

  // Render via portal to escape any parent overflow/z-index stacking
  if (!mounted) return null;
  return createPortal(chatUI, document.body);
}
