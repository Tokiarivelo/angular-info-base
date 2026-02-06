'use client';

import { useEffect, useState } from 'react';
import { useCreateCourseForm } from './CreateCourseForm.hooks';
import {
  Sparkles,
  Save,
  X,
  BookOpen,
  FileText,
  Loader2,
  ArrowRight,
  RefreshCw,
  Upload,
  File as FileIcon,
} from 'lucide-react';
import Link from 'next/link';
import ChapterEditModal from '../ChapterEditModal';
import { EditorBlock } from '../ChapterRichContentEditor/ChapterRichContentEditor.types';
import { Plus, Edit, Trash } from 'lucide-react';

interface LocalChapter {
  id: string; // Temporary ID
  title: string;
  description?: string;
  content?: EditorBlock[];
  imageUrl?: string;
  order: number;
}

export default function CreateCourseForm() {
  const {
    isPending,
    isGenerating,
    generatedData,
    models,
    isLoadingModels,
    handleCreateCourse,
    generateCourseMetadata,
    fetchModels,
  } = useCreateCourseForm();

  const [topic, setTopic] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  // Chapter Management
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [chapters, setChapters] = useState<LocalChapter[]>([]);
  const [editingChapterIndex, setEditingChapterIndex] = useState<number | null>(
    null
  );

  const handleSaveChapter = async (chapterId: string | null, data: any) => {
    // If editing existing
    if (editingChapterIndex !== null) {
      const updatedChapters = [...chapters];
      updatedChapters[editingChapterIndex] = {
        ...updatedChapters[editingChapterIndex],
        ...data,
      };
      setChapters(updatedChapters);
      setEditingChapterIndex(null);
    } else {
      // Determine order
      const newOrder =
        chapters.length > 0 ? Math.max(...chapters.map((c) => c.order)) + 1 : 1;

      const newChapter: LocalChapter = {
        id: `temp-${Date.now()}`,
        title: data.title,
        description: data.description,
        content: data.content,
        imageUrl: data.imageUrl,
        order: newOrder,
        ...data,
      };
      setChapters([...chapters, newChapter]);
    }
  };

  const handleEditChapter = (index: number) => {
    setEditingChapterIndex(index);
    setShowChapterModal(true);
  };

  const handleDeleteChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  // Handle form submission with chapters
  const handleSubmitWithChapters = (formData: FormData) => {
    // Append manually added chapters as JSON string
    if (chapters.length > 0) {
      // Combine AI suggested chapters (if any) with manually added ones
      // Or prioritize manual ones if they exist?
      // Let's interpret: manual chapters override AI suggestions if present,
      // or we can just append them. For now, let's treat 'chapters'
      // field in FormData as the source of truth.

      // We need to create a simplified version for the backend
      const chaptersData = chapters.map((c) => ({
        title: c.title,
        description: c.description,
        content: c.content,
        order: c.order,
        imageUrl: c.imageUrl,
      }));

      formData.set('chapters', JSON.stringify(chaptersData));
    }

    handleCreateCourse(formData);
  };

  // Set default model when models are loaded
  useEffect(() => {
    if (models && models.length > 0 && !selectedModel) {
      setSelectedModel(models[0].id);
    }
  }, [models, selectedModel]);

  // Update form when AI data is received
  useEffect(() => {
    if (generatedData) {
      setTitle(generatedData.title);
      setDescription(generatedData.description);
    }
  }, [generatedData]);

  const [targetTechnology, setTargetTechnology] = useState('');
  const [instructions, setInstructions] = useState('');
  const [generationLanguage, setGenerationLanguage] = useState<'en' | 'fr'>(
    'en'
  );

  // ... (previous state declarations)

  const onGenerate = () => {
    generateCourseMetadata(
      topic,
      selectedModel,
      file,
      targetTechnology,
      instructions,
      generationLanguage
    );
  };

  const LANGUAGES = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* AI Assistant Section */}
      {/* AI Assistant Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-purple-500/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>

        <div className="relative z-10">
          <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            AI Course Generator
          </h2>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-indigo-500/50">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Describe the course you want to create... (e.g., 'A comprehensive guide to Angular signals for intermediate developers')"
              className="w-full px-4 py-4 min-h-[120px] bg-transparent border-none outline-none resize-none dark:text-white placeholder-gray-400 text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onGenerate();
                }
              }}
              disabled={isGenerating}
            />

            {/* Attached File Chip */}
            {file && (
              <div className="px-4 pb-2">
                <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg w-fit text-sm border border-indigo-100 dark:border-indigo-800">
                  <FileIcon className="w-4 h-4" />
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <button
                    onClick={() => setFile(null)}
                    className="ml-1 p-0.5 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-gray-50/50 dark:bg-gray-800/50 border-t border-indigo-100 dark:border-indigo-800">
              <div className="flex flex-wrap items-center gap-2">
                {/* File Upload */}
                <label
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${file ? 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  title="Attach file (PDF, MD, CSV, JSON)"
                >
                  <Upload className="w-5 h-5" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept=".pdf,.txt,.md,.csv,.json"
                  />
                </label>

                {/* Language Selector */}
                <div className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    title="Output Language"
                  >
                    <span>{generationLanguage === 'en' ? '🇺🇸' : '🇫🇷'}</span>
                    <span className="hidden sm:inline">
                      {generationLanguage === 'en' ? 'English' : 'Français'}
                    </span>
                  </button>
                  <div className="absolute bottom-full left-0 pb-2 w-32 hidden group-hover:block z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                      {LANGUAGES.map((lang) => (
                        <button
                          type="button"
                          key={lang.value}
                          onClick={() =>
                            setGenerationLanguage(lang.value as 'en' | 'fr')
                          }
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${generationLanguage === lang.value ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'text-gray-700 dark:text-gray-300'}`}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Model Selector */}
                <div className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    title="AI Model"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isLoadingModels ? 'animate-spin' : ''}`}
                    />
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {models.find((m) => m.id === selectedModel)?.name ||
                        'Model'}
                    </span>
                  </button>
                  <div className="absolute bottom-full left-0 pb-2 w-48 hidden group-hover:block z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden max-h-60 overflow-y-auto">
                      {models.map((model) => (
                        <button
                          type="button"
                          key={model.id}
                          onClick={() => setSelectedModel(model.id)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 truncate ${selectedModel === model.id ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'text-gray-700 dark:text-gray-300'}`}
                        >
                          {model.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={onGenerate}
                disabled={isGenerating || (!topic.trim() && !file)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow-md"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Advanced Options Toggle / Panel */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={targetTechnology}
                onChange={(e) => setTargetTechnology(e.target.value)}
                placeholder="Target Tech (e.g. React, Angular) - Optional"
                className="w-full px-3 py-2 rounded-lg border border-indigo-100 dark:border-indigo-800 bg-white/50 dark:bg-gray-900/50 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Extra Instructions (e.g. 'For beginners') - Optional"
                className="w-full px-3 py-2 rounded-lg border border-indigo-100 dark:border-indigo-800 bg-white/50 dark:bg-gray-900/50 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Course Details
          </h2>
        </div>

        <form action={handleSubmitWithChapters} className="p-6 space-y-8">
          <div className="grid gap-6">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1"
              >
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all dark:text-white text-lg font-medium placeholder:font-normal"
                placeholder="e.g. Master Angular 17: From Zero to Hero"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all dark:text-white resize-y min-h-[120px]"
                placeholder="Describe what students will learn in this course..."
              />
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  Curriculum
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Structure your course with chapters.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingChapterIndex(null);
                  setShowChapterModal(true);
                }}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Chapter
              </button>
            </div>

            <div className="space-y-4">
              {chapters.length === 0 &&
              (!generatedData?.suggestedChapters ||
                generatedData.suggestedChapters.length === 0) ? (
                <div
                  onClick={() => setShowChapterModal(true)}
                  className="group cursor-pointer border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    Start your curriculum
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add your first chapter to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Manually Added Chapters */}
                  {chapters.map((chapter, idx) => (
                    <div
                      key={chapter.id}
                      className="group bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-base truncate">
                          {chapter.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          <span className="truncate max-w-[300px]">
                            {chapter.description || 'No description'}
                          </span>
                          {chapter.content && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                              <span>{chapter.content.length} blocks</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleEditChapter(idx)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                          title="Edit Chapter"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteChapter(idx)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Chapter"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* AI Suggestions with separate header if manual chapters exist */}
                  {generatedData?.suggestedChapters &&
                    generatedData.suggestedChapters.length > 0 && (
                      <div
                        className={`mt-6 pt-6 ${chapters.length > 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}
                      >
                        {chapters.length > 0 && (
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 pl-1">
                            AI Suggestions
                          </h4>
                        )}
                        <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity">
                          {generatedData.suggestedChapters.map(
                            (chapter, idx) => (
                              <div
                                key={idx}
                                className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center gap-3"
                              >
                                <span className="flex-shrink-0 w-6 h-6 rounded-md bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-medium text-xs">
                                  {chapters.length + idx + 1}
                                </span>
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300 block text-sm">
                                    {chapter.title}
                                  </span>
                                  <span className="text-gray-500 dark:text-gray-500 text-xs">
                                    {chapter.description}
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 sticky bottom-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 -mx-6 -mb-6 border-b rounded-b-2xl z-10">
            <Link
              href="/admin/courses"
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      {/* Chapter Edit Modal */}
      {showChapterModal && (
        <ChapterEditModal
          chapter={
            editingChapterIndex !== null
              ? (chapters[editingChapterIndex] as any)
              : null
          }
          courseId="new"
          courseContext={{
            title: title || 'New Course',
            description: description,
          }}
          isOpen={showChapterModal}
          onClose={() => {
            setShowChapterModal(false);
            setEditingChapterIndex(null);
          }}
          onSave={handleSaveChapter}
        />
      )}
    </div>
  );
}
