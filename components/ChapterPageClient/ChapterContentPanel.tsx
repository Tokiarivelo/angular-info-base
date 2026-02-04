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

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <span className="text-green-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="text-sm font-mono leading-relaxed">
        <SyntaxHighlighter
          language={language || 'typescript'}
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
  const previousChapter =
    currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < allChapters.length - 1
      ? allChapters[currentIndex + 1]
      : null;

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
      <div className="max-w-3xl mx-auto p-6 md:p-10 pb-24 space-y-10">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">
          <Link
            href="/courses"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Courses
          </Link>
          <span className="mx-2 text-gray-300 dark:text-gray-700">/</span>
          <span className="truncate max-w-[200px]">{chapter.Course.title}</span>
        </nav>

        {/* Header Section */}
        <header className="space-y-4 border-b border-gray-100 dark:border-gray-800 pb-8">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-wider">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs">
              {currentIndex + 1}
            </span>
            Chapter {currentIndex + 1}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            {chapter.title}
          </h1>

          {chapter.description && (
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
              {chapter.description}
            </p>
          )}

          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <BookOpen className="w-4 h-4" />
              <span>
                ~{Math.ceil((chapter.content?.length || 10) * 0.5)} min read
              </span>
            </div>
            {completed && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-wide rounded-full">
                <CheckCircle className="w-3.5 h-3.5" />
                Completed
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Content Blocks */}
        {chapter.content &&
          Array.isArray(chapter.content) &&
          chapter.content.length > 0 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {chapter.content.map((block: any) => {
                if (block.type === 'richText') {
                  return (
                    <article
                      key={block.id}
                      className="prose prose-lg dark:prose-invert max-w-none
                        prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                        prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
                        prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-50 dark:prose-code:bg-gray-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
                        prose-ul:marker:text-blue-500 prose-ol:marker:text-blue-500"
                      dangerouslySetInnerHTML={{ __html: block.content }}
                    />
                  );
                }
                if (block.type === 'proTip') {
                  return (
                    <div
                      key={block.id}
                      className="my-8 relative overflow-hidden rounded-xl border border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/10 p-6 shadow-sm group hover:shadow-md transition-all"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-blue-500/20 transition-colors"></div>

                      <div className="flex gap-4 relative z-10">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                            <span className="text-xl">💡</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="flex items-center gap-2 text-base font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wide mb-2">
                            {block.title || 'Pro Tip'}
                          </h4>
                          <div
                            className="prose prose-sm dark:prose-invert max-w-none text-blue-800 dark:text-blue-200"
                            dangerouslySetInnerHTML={{ __html: block.content }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
                if (block.type === 'image') {
                  return (
                    <figure key={block.id} className="my-8 group">
                      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                        <img
                          src={block.content}
                          alt={block.title || 'Chapter Image'}
                          className="w-full max-h-[600px] object-contain mx-auto transition-transform duration-700 group-hover:scale-[1.01]"
                          loading="lazy"
                        />
                      </div>
                      {block.title && (
                        <figcaption className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mt-3 flex items-center justify-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
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
                      className="py-8 flex items-center justify-center"
                    >
                      <div className="w-24 h-1 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}

        {/* Legacy Content Support (Intro, instructions, etc.) */}
        {chapter.introText && (
          <div className="prose dark:prose-invert max-w-none p-6 md:p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div dangerouslySetInnerHTML={{ __html: chapter.introText }} />
          </div>
        )}

        {/* Instructions Steps */}
        {chapter.instructions &&
          Array.isArray(chapter.instructions) &&
          chapter.instructions.length > 0 && (
            <div className="space-y-8 mt-12">
              <h3 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  <PlayCircle className="w-5 h-5" />
                </span>
                Step-by-Step Instructions
              </h3>

              <div className="relative border-l-2 border-dashed border-gray-200 dark:border-gray-800 ml-4 space-y-12 pb-4">
                {chapter.instructions.map((instruction: any, index: number) => (
                  <div key={index} className="relative pl-10">
                    {/* Step Marker */}
                    <div className="absolute -left-[17px] top-0 flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-900 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-sm shadow-sm z-10">
                      {index + 1}
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white pt-1">
                        {instruction.title}
                      </h4>

                      {instruction.description && (
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
                          dangerouslySetInnerHTML={{
                            __html: instruction.description,
                          }}
                        />
                      )}

                      {instruction.code && (
                        <div className="mt-4">
                          <CodeBlock
                            language="typescript"
                            code={instruction.code}
                          />
                        </div>
                      )}
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
              <div className="p-2 bg-pink-100 dark:bg-pink-900/20 rounded-lg text-pink-600 dark:text-pink-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Knowledge Check
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
        <section className="mt-12 py-10 border-t border-b border-gray-100 dark:border-gray-800 flex flex-col items-center text-center bg-gray-50/50 dark:bg-gray-900/30 -mx-6 md:-mx-10 px-6 md:px-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ready to move on?
          </h3>
          <ChapterCompletionToggle
            completed={completed}
            onToggle={onToggleCompletion}
            isPending={isPending}
          />
        </section>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center pt-8">
          {previousChapter ? (
            <Link
              href={`/courses/chapter/${previousChapter.id}`}
              className="group flex items-center gap-4 text-left p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors max-w-[45%]"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Previous
                </div>
                <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {previousChapter.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextChapter ? (
            <Link
              href={`/courses/chapter/${nextChapter.id}`}
              className="group flex items-center gap-4 text-right p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors max-w-[45%]"
            >
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Next Lesson
                </div>
                <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {nextChapter.title}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
