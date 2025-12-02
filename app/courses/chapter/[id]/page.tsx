import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ChapterProgressForm from '@/components/ChapterProgressForm';
import LinkPreview from '@/components/LinkPreview';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChapterPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/signin');
  }

  const { id: chapterId } = await params;

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: {
      course: true,
      checklists: {
        include: {
          items: true,
        },
      },
    },
  });

  if (!chapter) {
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

  // Get user's progress for this chapter
  const progress = await prisma.userChapterProgress.findUnique({
    where: {
      userId_chapterId: {
        userId: session.user.id,
        chapterId: chapterId,
      },
    },
  });

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
                {chapter.course.title}
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
          {chapter.checklists.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Checklists
              </h2>
              <div className="space-y-4">
                {chapter.checklists.map((checklist) => (
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
                      {checklist.items.map((item) => (
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
            <ChapterProgressForm chapterId={chapterId} progress={progress} />
          </div>

          {/* Link Previews */}
          {(progress?.repositoryUrl || progress?.websiteUrl) && (
            <div className="bg-white rounded-lg shadow p-6">
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
        </div>
      </div>
    </div>
  );
}
