'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import ChapterProgressForm from '@/components/ChapterProgressForm';
import LinkPreview from '@/components/LinkPreview';
import QuizTaker from '@/components/QuizTaker';

interface ChapterData {
  chapter: {
    id: string;
    title: string;
    description: string | null;
    content: string | null;
    livePreviewUrl: string | null;
    order: number;
    courseId: string;
    Course: {
      id: string;
      title: string;
    };
    Checklist: Array<{
      id: string;
      title: string;
      description: string | null;
      ChecklistItem: Array<{
        id: string;
        title: string;
      }>;
    }>;
    Quiz: Array<{
      id: string;
      title: string;
      description: string | null;
      passingScore: number;
      chapterId: string;
      QuizQuestion: Array<{
        id: string;
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string | null;
        order: number;
      }>;
    }>;
  };
  progress: {
    id: string;
    userId: string;
    chapterId: string;
    repositoryUrl: string | null;
    websiteUrl: string | null;
    completed: boolean;
    screenshots: Array<{
      id: string;
      url: string;
      publicId: string | null;
      caption: string | null;
    }>;
  } | null;
  allChapters: Array<{
    id: string;
    title: string;
    order: number;
  }>;
}

async function fetchChapterData(id: string): Promise<ChapterData> {
  const response = await fetch(`/api/courses/chapters/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch chapter data');
  }

  return response.json();
}

export default function ChapterPageClient({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['chapter', id],
    queryFn: () => fetchChapterData(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Chapter not found
          </h1>
          <Link
            href="/courses"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Go back to courses
          </Link>
        </div>
      </div>
    );
  }

  const { chapter, progress, allChapters } = data;
  const currentIndex = allChapters.findIndex((ch) => ch.id === id);
  const previousChapter =
    currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/checklist"
                className="text-xl font-bold text-gray-900"
              >
                Angular Checklist
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/courses"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Courses
              </Link>
              <Link
                href="/checklist"
                className="text-gray-700 hover:text-gray-900"
              >
                Checklists
              </Link>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-gray-900"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link
              href="/courses"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ← Back to Courses
            </Link>
          </div>

          {/* Chapter Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="mb-4">
              <span className="text-sm text-gray-500">
                {chapter.Course.title}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Chapter {chapter.order + 1}: {chapter.title}
            </h1>
            {chapter.description && (
              <p className="text-gray-600 mb-4">{chapter.description}</p>
            )}
            {chapter.livePreviewUrl && (
              <div className="mt-4">
                <a
                  href={chapter.livePreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Live Preview
                </a>
              </div>
            )}
          </div>

          {/* Chapter Checklists */}
          {chapter.Checklist.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Checklists
              </h2>
              <div className="space-y-4">
                {chapter.Checklist.map((checklist) => (
                  <div key={checklist.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {checklist.title}
                    </h3>
                    {checklist.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {checklist.description}
                      </p>
                    )}
                    <ul className="space-y-1">
                      {checklist.ChecklistItem.map((item) => (
                        <li key={item.id} className="text-sm text-gray-700">
                          • {item.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Your Progress
            </h2>
            <ChapterProgressForm chapterId={id} progress={progress} />
          </div>

          {/* Link Previews */}
          {(progress?.repositoryUrl || progress?.websiteUrl) && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Project Links
              </h2>
              <div className="space-y-4">
                {progress.repositoryUrl && (
                  <LinkPreview
                    url={progress.repositoryUrl}
                    title="GitHub Repository"
                  />
                )}
                {progress.websiteUrl && (
                  <LinkPreview
                    url={progress.websiteUrl}
                    title="Deployed Website"
                  />
                )}
              </div>
            </div>
          )}

          {/* Quizzes Section */}
          {chapter.Quiz.length > 0 && (
            <div className="space-y-6">
              {chapter.Quiz.map((quiz) => (
                <div key={quiz.id}>
                  <QuizTaker quiz={quiz} />
                </div>
              ))}
            </div>
          )}

          {/* Chapter Navigation */}
          <div className="mt-8 pt-6 border-t flex justify-between items-center">
            {previousChapter ? (
              <Link
                href={`/courses/chapter/${previousChapter.id}`}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <div>
                  <div className="text-xs text-gray-500">Previous</div>
                  <div className="font-medium">{previousChapter.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextChapter ? (
              <Link
                href={`/courses/chapter/${nextChapter.id}`}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <div className="text-right">
                  <div className="text-xs text-gray-500">Next</div>
                  <div className="font-medium">{nextChapter.title}</div>
                </div>
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
