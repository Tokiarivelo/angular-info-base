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

  const onGenerate = () => {
    generateCourseMetadata(topic, selectedModel, file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* AI Assistant Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-purple-500/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>

        <div className="relative z-10">
          <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Generate with AI
          </h2>
          <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-4 max-w-xl">
            Enter a topic or upload a document, and our AI will draft a title,
            description, and suggest a curriculum structure for you.
          </p>

          <div className="flex flex-wrap gap-3 w-full">
            {isLoadingModels ? (
              <div className="h-10 w-full sm:w-48 bg-white/20 animate-pulse rounded-xl"></div>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={isGenerating}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white text-sm min-w-[200px]"
                  title="Select AI Model"
                >
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => fetchModels()}
                  className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-colors flex-shrink-0"
                  title="Refresh Models"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="flex-1 flex gap-2 w-full sm:w-auto min-w-[200px]">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={
                    file
                      ? `File: ${file.name}`
                      : 'e.g. Advanced React Patterns...'
                  }
                  className={`w-full px-4 py-2.5 rounded-xl border ${file ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 pl-10' : 'border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-900'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white pr-20`}
                  onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
                  disabled={!!file}
                />
                {file && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500">
                    <FileIcon className="w-4 h-4" />
                  </div>
                )}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {file && (
                    <button
                      onClick={() => setFile(null)}
                      className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-lg transition-colors"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <label
                    className={`cursor-pointer p-1.5 rounded-lg transition-colors ${file ? 'hidden' : 'hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-500'}`}
                    title="Upload file context"
                  >
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      accept=".pdf,.txt,.md,.csv"
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={onGenerate}
              disabled={isGenerating || (!topic.trim() && !file)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            Course Details
          </h2>
        </div>

        <form action={handleCreateCourse} className="p-6 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
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
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="Enter course title"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white resize-y min-h-[120px]"
              placeholder="What will students learn in this course?"
            />
          </div>

          {generatedData?.suggestedChapters &&
            generatedData.suggestedChapters.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  AI Suggested Chapters
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  These chapters will be created automatically with the course.
                </p>
                <input
                  type="hidden"
                  name="chapters"
                  value={JSON.stringify(generatedData.suggestedChapters)}
                />
                <ul className="space-y-3">
                  {generatedData.suggestedChapters.map((chapter, idx) => (
                    <li key={idx} className="flex gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white block">
                          {chapter.title}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          {chapter.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
            <Link
              href="/admin/courses"
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center gap-2"
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
    </div>
  );
}
