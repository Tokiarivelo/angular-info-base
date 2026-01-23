import Link from 'next/link';
import QuizTaker from '@/components/QuizTaker';
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
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
    <div className="relative group my-4 rounded-lg overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-mono text-gray-400 uppercase">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'typescript'}
        style={vscDarkPlus}
        showLineNumbers={true}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 0.5rem 0.5rem',
          fontSize: '0.9rem',
        }}
        wrapLines={true}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
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
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/courses"
          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Courses
        </Link>
      </div>
      {/* Header */}
      <div>
        <div className="text-sm text-muted-foreground mb-2">
          {chapter.Course.title}
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          {chapter.title}
        </h1>
        {chapter.description && (
          <div className="prose dark:prose-invert max-w-none text-muted-foreground">
            {chapter.description}
          </div>
        )}
      </div>

      {/* Dynamic Content Blocks */}
      {chapter.content &&
        Array.isArray(chapter.content) &&
        chapter.content.length > 0 && (
          <div className="space-y-6">
            {chapter.content.map((block: any) => {
              if (block.type === 'richText') {
                return (
                  <div
                    key={block.id}
                    className="prose prose-lg dark:prose-invert max-w-none
                      prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                      prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12
                      prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-10
                      prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8
                      prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6
                      prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:my-5
                      prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
                      prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
                      prose-ul:list-disc prose-ul:pl-6 prose-ul:my-5 prose-li:my-2
                      prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-5
                      prose-li:text-gray-700 dark:prose-li:text-gray-300
                      [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:mt-12
                      [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:mb-5 [&>h2]:mt-10
                      [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:mt-8
                      [&>p]:text-gray-700 [&>p]:dark:text-gray-300 [&>p]:text-base [&>p]:leading-relaxed
                      [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                );
              }
              if (block.type === 'proTip') {
                return (
                  <div
                    key={block.id}
                    className="my-6 rounded-r-lg border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-950/30 p-4 shadow-sm"
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg
                          className="w-5 h-5 text-blue-600 dark:text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                            {block.title || 'NOTE'}
                          </span>
                        </div>
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none
                            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:my-0
                            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium hover:prose-a:underline
                            prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono"
                          dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                      </div>
                    </div>
                  </div>
                );
              }
              if (block.type === 'image') {
                return (
                  <div key={block.id} className="my-6">
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                      <img
                        src={block.content}
                        alt={block.title || 'Chapter Image'}
                        className="w-full max-h-[500px] object-contain mx-auto"
                        loading="lazy"
                      />
                    </div>
                    {block.title && (
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                        {block.title}
                      </p>
                    )}
                  </div>
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
                  <div key={block.id} className="my-8">
                    <hr className="border-t-2 border-gray-300 dark:border-gray-600" />
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      {/* Introduction Text */}
      {chapter.introText && (
        <div className="prose dark:prose-invert max-w-none bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <div
            className="text-base leading-relaxed text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: chapter.introText }}
          />
        </div>
      )}
      {/* Pro Tips */}
      {chapter.proTips &&
        Array.isArray(chapter.proTips) &&
        chapter.proTips.length > 0 && (
          <div className="space-y-4">
            {chapter.proTips.map((tip: any, index: number) => (
              <div
                key={index}
                className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-l-4 border-amber-500 p-6 flex gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-600 dark:to-orange-700 flex items-center justify-center shadow-lg">
                    <span className="text-3xl">💡</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-amber-900 dark:text-amber-100 mb-3">
                    {tip.title || 'Pro Tip'}
                  </h3>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none text-amber-900 dark:text-amber-100"
                    dangerouslySetInnerHTML={{ __html: tip.content }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      {/* Instructions */}
      {chapter.instructions &&
        Array.isArray(chapter.instructions) &&
        chapter.instructions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
              <span className="text-blue-600 dark:text-blue-400">📋</span>
              <span>Instructions</span>
            </div>
            <div className="space-y-4">
              {chapter.instructions.map((instruction: any, index: number) => (
                <div
                  key={index}
                  className="rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-md transition-all p-6"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                        {instruction.step || index + 1}
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                        {instruction.title}
                      </h3>
                      {instruction.description && (
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                          dangerouslySetInnerHTML={{
                            __html: instruction.description,
                          }}
                        />
                      )}
                      {instruction.code && (
                        <div className="relative group">
                          <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border-2 border-gray-700 font-mono">
                            <code>{instruction.code}</code>
                          </pre>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(instruction.code)
                            }
                            className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-xs text-gray-300 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
                            title="Copy code"
                          >
                            <span>📋</span>
                            <span>Copy</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      {/* Instructions / Checklists */}
      {chapter.Checklist.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <span className="text-primary">Instructions</span>
          </div>
          <div className="space-y-6">
            {chapter.Checklist.map((checklist: any) => (
              <div
                key={checklist.id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm p-6"
              >
                <h3 className="font-semibold text-lg mb-2">
                  {checklist.title}
                </h3>
                {checklist.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {checklist.description}
                  </p>
                )}
                <ul className="space-y-3">
                  {checklist.ChecklistItem.map((item: any) => (
                    <li key={item.id} className="flex gap-3 text-sm">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Quizzes */}
      {chapter.Quiz.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Quiz</h2>
          <div className="space-y-6">
            {chapter.Quiz.map((quiz: any) => (
              <div key={quiz.id} className="rounded-lg border bg-card p-4">
                <QuizTaker quiz={quiz} />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Completion Toggle */}
      <div className="py-6 border-t">
        <ChapterCompletionToggle
          completed={completed}
          onToggle={onToggleCompletion}
          isPending={isPending}
        />
      </div>
      {/* Navigation */}
      <div className="flex justify-between items-center">
        {previousChapter ? (
          <Link
            href={`/courses/chapter/${previousChapter.id}`}
            className="group flex flex-col gap-1 text-sm"
          >
            <span className="text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
              <ChevronLeft className="w-4 h-4" /> Previous
            </span>
            <span className="font-medium">{previousChapter.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextChapter ? (
          <Link
            href={`/courses/chapter/${nextChapter.id}`}
            className="group flex flex-col gap-1 text-sm text-right"
          >
            <span className="text-muted-foreground flex items-center justify-end gap-1 group-hover:text-primary transition-colors">
              Next <ChevronRight className="w-4 h-4" />
            </span>
            <span className="font-medium">{nextChapter.title}</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
