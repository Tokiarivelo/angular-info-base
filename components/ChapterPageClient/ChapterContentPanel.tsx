'use client';

import Link from 'next/link';
import QuizTaker from '@/components/QuizTaker';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  BookOpen,
  CheckCircle,
  Circle,
  PlayCircle,
} from 'lucide-react';
import ChapterCompletionToggle from '@/components/ChapterProgressForm/components/ChapterCompletionToggle';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { getReaderDiffLineClass } from '@/components/admin/ChapterRichContentEditor/utils/diffLineUtils';

interface ChapterContentPanelProps {
  chapter: any;
  allChapters: any[];
  currentIndex: number;
  completed: boolean;
  onToggleCompletion: () => Promise<void>;
  isPending: boolean;
}

const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const [copied, setCopied] = useState(false);
  const t = useTranslations('chapterContent');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDiff = language === 'diff';
  const codeLines = isDiff ? code.split('\n') : [];

  return (
    <div className="relative group my-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-[#3e3e42]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ec5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#f5fb5d]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#62c554]" />
          </div>
          <span className="text-xs font-mono text-gray-400 uppercase ml-2 select-none">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white bg-transparent hover:bg-white/10 rounded transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400 font-medium">
                {t('code.copied')}
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{t('code.copy')}</span>
            </>
          )}
        </button>
      </div>

      {/* Diff legend */}
      {isDiff && (
        <div className="flex items-center gap-3 px-4 py-1.5 bg-[#252526] border-b border-[#3e3e42]">
          <span className="flex items-center gap-1.5 text-[10px] font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#2ea04370]" />
            <span className="text-[#3fb950]">{t('diff.added')}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#f8514970]" />
            <span className="text-[#f85149]">{t('diff.removed')}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#d29922]/30" />
            <span className="text-[#d29922]">{t('diff.changed')}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#58a6ff]/20" />
            <span className="text-[#58a6ff]">{t('diff.chunk')}</span>
          </span>
        </div>
      )}

      <div className="text-sm font-mono leading-relaxed">
        <SyntaxHighlighter
          language={isDiff ? 'diff' : language || 'typescript'}
          style={vscDarkPlus}
          showLineNumbers={true}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            fontSize: '13px',
          }}
          wrapLines={true}
          wrapLongLines={true}
          lineProps={
            isDiff
              ? (lineNumber: number) => {
                  const lineContent = codeLines[lineNumber - 1] || '';
                  const className = getReaderDiffLineClass(lineContent);
                  return {
                    style: { display: 'block' },
                    ...(className ? { className } : {}),
                  };
                }
              : undefined
          }
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default function ChapterContentPanel({
  chapter,
  allChapters,
  currentIndex,
  completed,
  onToggleCompletion,
  isPending,
}: ChapterContentPanelProps) {
  const t = useTranslations('chapterContent');
  const previousChapter =
    currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < allChapters.length - 1
      ? allChapters[currentIndex + 1]
      : null;

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto p-8 md:p-12 pb-32 space-y-12">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
          <Link
            href="/courses"
            className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {t('breadcrumb.courses')}
          </Link>
          <span className="mx-3 text-gray-300 dark:text-gray-700">/</span>
          <span className="truncate max-w-[200px] text-gray-900 dark:text-white">
            {chapter.Course.title}
          </span>
        </nav>

        {/* Header Section */}
        <header className="space-y-6 pb-8 border-b border-gray-100 dark:border-gray-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <span>{t('chapterLabel', { number: currentIndex + 1 })}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
            {chapter.title}
          </h1>

          {chapter.description && (
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl font-light">
              {chapter.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <span>
                {t('readingTime', {
                  minutes: Math.ceil((chapter.content?.length || 10) * 0.5),
                })}
              </span>
            </div>
            {completed && (
              <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-bold">
                <CheckCircle className="w-4 h-4 fill-green-100 dark:fill-green-900/30" />
                {t('completed')}
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Content Blocks */}
        {chapter.content &&
          Array.isArray(chapter.content) &&
          chapter.content.length > 0 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {chapter.content.map((block: any) => {
                if (block.type === 'richText') {
                  return (
                    <article
                      key={block.id}
                      className="prose prose-lg dark:prose-invert max-w-none
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white
                        prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-8
                        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
                        prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:bg-indigo-50 dark:prose-code:bg-indigo-900/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                        prose-ul:marker:text-gray-300 dark:prose-ul:marker:text-gray-600 prose-li:pl-0"
                      dangerouslySetInnerHTML={{ __html: block.content }}
                    />
                  );
                }
                if (block.type === 'proTip') {
                  return (
                    <div
                      key={block.id}
                      className="my-10 overflow-hidden rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-900/10 p-6 md:p-8"
                    >
                      <div className="flex gap-5">
                        <div className="flex-shrink-0 pt-1">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-indigo-950 flex items-center justify-center shadow-sm text-xl border border-indigo-100 dark:border-indigo-800">
                            💡
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <h4 className="font-bold text-indigo-950 dark:text-indigo-200 text-lg">
                            {block.title || t('proTip')}
                          </h4>
                          <div
                            className="prose prose-sm dark:prose-invert max-w-none text-indigo-900/80 dark:text-indigo-300/90 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: block.content }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
                if (block.type === 'image') {
                  return (
                    <figure key={block.id} className="my-10">
                      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                        <img
                          src={block.content}
                          alt={block.title || t('imageAlt')}
                          className="w-full max-h-[600px] object-contain mx-auto"
                          loading="lazy"
                        />
                      </div>
                      {block.title && (
                        <figcaption className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mt-4">
                          {block.title}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
                if (block.type === 'code') {
                  return (
                    <CodeBlock
                      key={block.id}
                      language={block.title || 'typescript'}
                      code={block.content}
                    />
                  );
                }
                if (block.type === 'separator') {
                  return (
                    <div
                      key={block.id}
                      className="py-12 flex items-center justify-center"
                    >
                      <div className="w-16 h-1 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}

        {/* Legacy Content Support (Intro, instructions, etc.) */}
        {chapter.introText && (
          <div className="prose prose-lg dark:prose-invert max-w-none p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <div dangerouslySetInnerHTML={{ __html: chapter.introText }} />
          </div>
        )}

        {/* Instructions Steps */}
        {chapter.instructions &&
          Array.isArray(chapter.instructions) &&
          chapter.instructions.length > 0 && (
            <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white mb-10">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                  <PlayCircle className="w-5 h-5" />
                </span>
                {t('instructions.title')}
              </h3>

              <div className="space-y-12 pb-4">
                {chapter.instructions.map((instruction: any, index: number) => (
                  <div key={index} className="relative pl-4 md:pl-0">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                      <div className="flex-shrink-0 flex flex-col items-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm border border-indigo-100 dark:border-indigo-800">
                          {index + 1}
                        </div>
                        {index < chapter.instructions.length - 1 && (
                          <div className="w-px h-full bg-gray-200 dark:bg-gray-800 my-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                          {instruction.title}
                        </h4>
                        {instruction.description && (
                          <div
                            className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed mb-6"
                            dangerouslySetInnerHTML={{
                              __html: instruction.description,
                            }}
                          />
                        )}
                        {instruction.code && (
                          <CodeBlock
                            language="typescript"
                            code={instruction.code}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Quizzes Section */}
        {chapter.Quiz.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-xl text-pink-600 dark:text-pink-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('knowledgeCheck')}
              </h2>
            </div>

            <div className="grid gap-6">
              {chapter.Quiz.map((quiz: any) => (
                <div
                  key={quiz.id}
                  className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <QuizTaker quiz={quiz} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Completion Action */}
        <section className="mt-20 py-16 flex flex-col items-center text-center">
          <div className="mb-8 p-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
            <div className="bg-white dark:bg-gray-950 rounded-full p-2">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {t('readyToMoveOn')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
            Mark this lesson as complete to track your progress and unlock the
            next chapter.
          </p>
          <ChapterCompletionToggle
            completed={completed}
            onToggle={onToggleCompletion}
            isPending={isPending}
          />
        </section>

        {/* Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-gray-100 dark:border-gray-800">
          {previousChapter ? (
            <Link
              href={`/courses/chapter/${previousChapter.id}`}
              className="group flex flex-col p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all bg-white dark:bg-gray-900"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                <ChevronLeft className="w-3 h-3" />
                {t('navigation.previous')}
              </div>
              <div className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {previousChapter.title}
              </div>
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}

          {nextChapter ? (
            <Link
              href={`/courses/chapter/${nextChapter.id}`}
              className="group flex flex-col items-end text-right p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all bg-white dark:bg-gray-900"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                {t('navigation.nextLesson')}
                <ChevronRight className="w-3 h-3" />
              </div>
              <div className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {nextChapter.title}
              </div>
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}
        </div>
      </div>
    </div>
  );
}
