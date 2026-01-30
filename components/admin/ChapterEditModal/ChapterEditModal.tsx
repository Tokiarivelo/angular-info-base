'use client';

import { useState } from 'react';
import { X, Upload, FileText, Sparkles } from 'lucide-react';
import { ChapterEditModalProps } from './ChapterEditModal.types';
import { useChapterEditModal } from './ChapterEditModal.hooks';
import ChapterRichContentEditor from '../ChapterRichContentEditor';
import { EditorBlock } from '../ChapterRichContentEditor/ChapterRichContentEditor.types';
import AIChapterChat from '../AIChapterChat';
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {chapter ? `Edit Chapter: ${chapter.title}` : 'Add New Chapter'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b dark:border-gray-700 px-6">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'basic'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'content'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Rich Content
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'import'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Import File
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'ai'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Generate
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Introduction to Angular"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Brief description of the chapter content..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Live Preview URL
                  </label>
                  <input
                    type="url"
                    value={livePreviewUrl}
                    onChange={(e) => setLivePreviewUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Chapter Image
                  </h3>
                  {!imageUrl && (
                    <button
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage || isUploadingImage}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      title="Generate image with AI based on chapter content"
                    >
                      {isGeneratingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate with AI
                        </>
                      )}
                    </button>
                  )}
                </div>

                {imageUrl ? (
                  <div className="relative group w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                    <img
                      src={imageUrl}
                      alt="Chapter cover"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={handleRemoveImage}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                      >
                        Remove Image
                      </button>
                      <button
                        onClick={handleGenerateImage}
                        disabled={isGeneratingImage}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {isGeneratingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Regenerating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Regenerate
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 bg-gray-50 dark:bg-gray-800/50 transition-colors">
                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                      {isUploadingImage ? (
                        <div className="flex flex-col items-center space-y-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Uploading...
                          </span>
                        </div>
                      ) : isGeneratingImage ? (
                        <div className="flex flex-col items-center space-y-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Generating with AI...
                          </span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-gray-400 mb-3" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Click to upload image
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            PNG, JPG, up to 5MB
                          </span>
                          <span className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                            Or use &quot;Generate with AI&quot; button above
                          </span>
                        </>
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
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {imageUploadError}
                  </p>
                )}
                {imageGenerationError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {imageGenerationError}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <ChapterRichContentEditor
              chapter={{
                id: chapter?.id || 'new', // Placeholder for creation
                title: chapter?.title || title || 'New Chapter',
                description: description,
                content,
                // Pass deprecated fields only if needed for migration within the component
                introText: null,
                proTips: null,
                instructions: null,
              }}
              onSave={async (data) => {
                // Update local state immediately
                setContent(data.content);
                // Return success - don't actually save to server here
                return Promise.resolve();
              }}
            />
          )}

          {activeTab === 'import' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Import Content from File
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  Upload a CSV or Markdown file to automatically populate rich
                  content.
                </p>
                <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <details className="cursor-pointer">
                    <summary className="font-medium">CSV Format</summary>
                    <pre className="mt-2 bg-white dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                      {`type,title,content,code
                        intro,,Introduction text goes here,
                        tip,Pro Tip Title,Tip content,
                        instruction,Step Title,Step description,code snippet`}
                    </pre>
                  </details>
                  <details className="cursor-pointer">
                    <summary className="font-medium">Markdown Format</summary>
                    <pre className="mt-2 bg-white dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                      {`# Introduction
                        Intro text here

                        ## Pro Tip: Title
                        Tip content

                        ## Instruction: Title
                        Description
                        \`\`\`
                        code
                        \`\`\``}
                    </pre>
                  </details>
                </div>
              </div>

              <div
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-all ${
                  isDragging
                    ? 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
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
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <button
                  onClick={triggerFileImport}
                  disabled={isImporting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  {isImporting ? 'Importing...' : 'Choose File'}
                </button>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  CSV or Markdown files only
                </p>
              </div>

              {importError && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {importError}
                  </p>
                </div>
              )}

              {!importError && content && content.length > 0 && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✓ Content loaded ({content.length} blocks)! Switch to
                    &quot;Rich Content&quot; tab to review.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Generate with AI
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                  Use Gemini AI to generate structured chapter content including
                  text, code examples, and pro tips based on your description.
                </p>
                <button
                  onClick={() => setShowAIChat(true)}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <Sparkles className="w-5 h-5" />
                  Open AI Chat
                </button>
              </div>

              {content && content.length > 0 && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✓ {content.length} content blocks ready! Switch to
                    &quot;Rich Content&quot; tab to review and edit.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* AI Chat Modal */}
      {showAIChat && (
        <AIChapterChat
          courseContext={courseContext}
          onApplyBlocks={(blocks: EditorBlock[]) => {
            setContent(blocks);
            setShowAIChat(false);
            setActiveTab('content');
          }}
          onApplyChapter={(data: GeneratedChapterData) => {
            // Apply all generated chapter data
            if (data.title) setTitle(data.title);
            if (data.description) setDescription(data.description);
            if (data.imageUrl) setImageUrl(data.imageUrl);
            setContent(data.blocks);
            setShowAIChat(false);
            setActiveTab('basic'); // Go to basic tab to see title/description
          }}
          onClose={() => setShowAIChat(false)}
        />
      )}
    </div>
  );
}
