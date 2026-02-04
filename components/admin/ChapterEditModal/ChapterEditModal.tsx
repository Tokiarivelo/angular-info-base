'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Upload,
  FileText,
  Sparkles,
  Image as ImageIcon,
  Layout,
  Save,
  Monitor,
  Info,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
} from 'lucide-react';
import { ChapterEditModalProps } from './ChapterEditModal.types';
import { useChapterEditModal } from './ChapterEditModal.hooks';
import ChapterRichContentEditor from '../ChapterRichContentEditor';
import AIChapterChat from '../AIChapterChat';
import { EditorBlock } from '../ChapterRichContentEditor/ChapterRichContentEditor.types';
import { GeneratedChapterData } from '../AIChapterChat/AIChapterChat.types';

type Tab = 'basic' | 'content' | 'import' | 'ai';

export default function ChapterEditModal({
  chapter,
  courseContext,
  isOpen,
  onClose,
  onSave,
}: ChapterEditModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  const {
    title,
    setTitle,
    description,
    setDescription,
    imageUrl,
    isUploadingImage,
    imageUploadError,
    handleImageUpload,
    handleRemoveImage,
    // AI Image Generation
    isGeneratingImage,
    imageGenerationError,
    handleGenerateImage,
    livePreviewUrl,
    setLivePreviewUrl,
    content,
    setContent,
    fileInputRef,
    isImporting,
    importError,
    handleFileImport,
    triggerFileImport,
    isDragging,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    getUpdateData,
    setImageUrl,
  } = useChapterEditModal(chapter);

  // Reset tab when opening for a new chapter vs editing
  useEffect(() => {
    if (isOpen) {
      setActiveTab('basic');
    }
  }, [isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(chapter?.id || null, getUpdateData());
      onClose();
    } catch (error) {
      console.error('Failed to save chapter:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 transition-all transform scale-100">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {chapter ? <>Edit Chapter</> : <>Create New Chapter</>}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {chapter
                ? `Updating "${chapter.title}"`
                : 'Add content to your course'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar + Content Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation (Desktop) */}
          <div className="hidden md:flex flex-col w-64 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-100 dark:border-gray-800 p-4 space-y-2">
            <NavButton
              active={activeTab === 'basic'}
              onClick={() => setActiveTab('basic')}
              icon={<Info className="w-4 h-4" />}
              label="Basic Info"
              description="Title, description, cover"
            />
            <NavButton
              active={activeTab === 'content'}
              onClick={() => setActiveTab('content')}
              icon={<Layout className="w-4 h-4" />}
              label="Rich Content"
              description="Editor, text, media in blocks"
              badge={content?.length ? `${content.length}` : undefined}
            />
            <NavButton
              active={activeTab === 'import'}
              onClick={() => setActiveTab('import')}
              icon={<FileText className="w-4 h-4" />}
              label="Import File"
              description="From Markdown or CSV"
            />
            <div className="pt-4 mt-auto">
              <div className="px-3 pb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                AI Tools
              </div>
              <NavButton
                active={activeTab === 'ai'}
                onClick={() => setActiveTab('ai')}
                icon={<Sparkles className="w-4 h-4" />}
                label="AI Generator"
                description="Generate content with AI"
                variant="purple"
              />
            </div>
          </div>

          {/* Mobile Navigation (Tabs) */}
          <div className="md:hidden flex border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
            {/* ... simplified tabs for mobile ... */}
            <MobileTab
              active={activeTab === 'basic'}
              onClick={() => setActiveTab('basic')}
              label="Basic"
              icon={<Info className="w-4 h-4" />}
            />
            <MobileTab
              active={activeTab === 'content'}
              onClick={() => setActiveTab('content')}
              label="Content"
              icon={<Layout className="w-4 h-4" />}
            />
            <MobileTab
              active={activeTab === 'import'}
              onClick={() => setActiveTab('import')}
              label="Import"
              icon={<FileText className="w-4 h-4" />}
            />
            <MobileTab
              active={activeTab === 'ai'}
              onClick={() => setActiveTab('ai')}
              label="AI"
              icon={<Sparkles className="w-4 h-4" />}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
            <div className="p-6 max-w-4xl mx-auto">
              {activeTab === 'basic' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {/* Title & Description */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Chapter Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Introduction to Angular Signals"
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Briefly describe what students will learn in this chapter..."
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-gray-400" />
                        Live Preview URL{' '}
                        <span className="text-xs font-normal text-gray-400">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="url"
                        value={livePreviewUrl}
                        onChange={(e) => setLivePreviewUrl(e.target.value)}
                        placeholder="https://stackblitz.com/..."
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-gray-800" />

                  {/* Cover Image Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Chapter Cover Image
                      </label>
                      {!imageUrl && (
                        <button
                          onClick={handleGenerateImage}
                          disabled={isGeneratingImage || isUploadingImage}
                          className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-colors border border-purple-100 dark:border-purple-800"
                        >
                          {isGeneratingImage ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3" />
                          )}
                          Auto-generate
                        </button>
                      )}
                    </div>

                    {imageUrl ? (
                      <div className="relative group w-full aspect-video md:h-64 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                        <img
                          src={imageUrl}
                          alt="Chapter cover"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                          <button
                            onClick={handleRemoveImage}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600/90 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg font-medium text-sm"
                          >
                            <Trash2 className="w-4 h-4" /> Remove
                          </button>
                          <button
                            onClick={handleGenerateImage}
                            disabled={isGeneratingImage}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/30 rounded-lg hover:bg-white/20 transition-colors shadow-lg font-medium text-sm backdrop-blur-md"
                          >
                            {isGeneratingImage ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Sparkles className="w-4 h-4" />
                            )}
                            Regenerate
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="group relative border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200">
                        <label className="cursor-pointer flex flex-col items-center justify-center py-12 px-4 w-full h-full">
                          {isUploadingImage ? (
                            <div className="text-center">
                              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-3" />
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                Uploading image...
                              </p>
                            </div>
                          ) : isGeneratingImage ? (
                            <div className="text-center">
                              <div className="relative">
                                <Sparkles className="w-10 h-10 text-purple-500 animate-pulse mx-auto mb-3" />
                                <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 rounded-full"></div>
                              </div>
                              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                Dreaming up an image...
                              </p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                                <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                              </div>
                              <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                Click to upload or drag and drop
                              </span>
                              <span className="block text-xs text-gray-400 mt-1">
                                SVG, PNG, JPG or GIF (max 5MB)
                              </span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploadingImage || isGeneratingImage}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}

                    {imageUploadError && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" /> {imageUploadError}
                      </p>
                    )}
                    {imageGenerationError && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />{' '}
                        {imageGenerationError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 h-full">
                  <ChapterRichContentEditor
                    chapter={{
                      id: chapter?.id || 'new',
                      title: chapter?.title || title || 'New Chapter',
                      description: description,
                      content,
                      introText: null,
                      proTips: null,
                      instructions: null,
                    }}
                    onSave={async (data) => {
                      setContent(data.content);
                      return Promise.resolve();
                    }}
                  />
                </div>
              )}

              {activeTab === 'import' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Import Content
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Populate this chapter instantly by uploading a
                          pre-written file. Perfect for migrating content.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white dark:bg-gray-900/50 p-3 rounded-lg border border-blue-100 dark:border-blue-800/50 text-sm">
                        <span className="font-semibold text-gray-700 dark:text-gray-200 block mb-1">
                          Markdown (.md)
                        </span>
                        <code className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1 py-0.5 rounded">
                          # Header
                        </code>{' '}
                        supports images, code blocks, and lists.
                      </div>
                      <div className="bg-white dark:bg-gray-900/50 p-3 rounded-lg border border-blue-100 dark:border-blue-800/50 text-sm">
                        <span className="font-semibold text-gray-700 dark:text-gray-200 block mb-1">
                          CSV (.csv)
                        </span>
                        <code className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1 py-0.5 rounded">
                          type,title,content
                        </code>{' '}
                        for structured data import.
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 transition-all duration-200 ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
                        : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.md"
                      onChange={handleFileImport}
                      className="hidden"
                    />

                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                      <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>

                    <button
                      onClick={triggerFileImport}
                      disabled={isImporting}
                      className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isImporting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />{' '}
                          Processing...
                        </span>
                      ) : (
                        'Choose File to Upload'
                      )}
                    </button>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      or drag and drop your file here
                    </p>
                  </div>

                  {importError && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-red-900 dark:text-red-300">
                          Import Failed
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                          {importError}
                        </p>
                      </div>
                    </div>
                  )}

                  {!importError && content && content.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-300">
                          Success! {content.length} content blocks loaded.
                        </p>
                        <button
                          onClick={() => setActiveTab('content')}
                          className="text-xs font-semibold text-green-700 underline mt-1 hover:text-green-900"
                        >
                          Review in Editor &rarr;
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 text-center py-8">
                  <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-3xl mb-4 relative">
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
                    <Sparkles className="relative w-12 h-12 text-purple-600 dark:text-purple-400" />
                  </div>

                  <div className="max-w-lg mx-auto mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      AI Content Generator
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      Let Gemini AI architect your chapter. It can structure
                      topics, write code examples, and generate quizzes
                      instantly.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAIChat(true)}
                    className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Start AI Assistant
                    </span>
                  </button>

                  {content && content.length > 0 && (
                    <div className="mt-8 mx-auto max-w-sm bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>
                        Current chapter has <strong>{content.length}</strong>{' '}
                        blocks.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center z-10">
          <div className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
            {isSaving
              ? 'Saving changes...'
              : 'Unsaved changes are roughly drafted.'}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Chapter
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Chat Modal Overlay */}
      {showAIChat && (
        <AIChapterChat
          courseContext={courseContext}
          onApplyBlocks={(blocks: EditorBlock[]) => {
            setContent(blocks);
            setShowAIChat(false);
            setActiveTab('content');
          }}
          onApplyChapter={(data: GeneratedChapterData) => {
            if (data.title) setTitle(data.title);
            if (data.description) setDescription(data.description);
            if (data.imageUrl) setImageUrl(data.imageUrl);
            setContent(data.blocks);
            setShowAIChat(false);
            setActiveTab('basic');
          }}
          onClose={() => setShowAIChat(false)}
        />
      )}
    </div>
  );
}

// Helper Components for Cleaner Main Component

function NavButton({
  active,
  onClick,
  icon,
  label,
  description,
  badge,
  variant = 'blue',
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description?: string;
  badge?: string;
  variant?: 'blue' | 'purple';
}) {
  const activeClass =
    variant === 'blue'
      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      : 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';

  const hoverClass =
    variant === 'blue'
      ? 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
      : 'hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-700 dark:hover:text-purple-300';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl transition-all border ${
        active
          ? `${activeClass} shadow-sm`
          : `border-transparent text-gray-600 dark:text-gray-400 ${hoverClass}`
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5 font-semibold">
          {icon}
          <span>{label}</span>
        </div>
        {badge && (
          <span className="bg-white dark:bg-gray-800 text-xs font-bold px-1.5 py-0.5 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
            {badge}
          </span>
        )}
      </div>
      {description && (
        <div
          className={`text-xs ml-6.5 truncate ${active ? 'opacity-80' : 'opacity-60'}`}
        >
          {description}
        </div>
      )}
    </button>
  );
}

function MobileTab({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center p-3 text-xs font-medium border-b-2 transition-colors ${
        active
          ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
          : 'border-transparent text-gray-500 dark:text-gray-400'
      }`}
    >
      <div className="mb-1">{icon}</div>
      {label}
    </button>
  );
}
