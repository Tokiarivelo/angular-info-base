import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CourseEditForm from '@/components/admin/CourseEditForm';
import ChaptersList from '@/components/admin/ChaptersList';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCoursePage({ params }: PageProps) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
        include: {
          _count: {
            select: { quizzes: true, userProgress: true },
          },
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/courses"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Back to Courses
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {course.title}
        </h1>
        <div className="text-gray-600">
          {course._count.enrollments} enrollments
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <CourseEditForm course={course} />
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link
              href={`/courses/chapter/${course.chapters[0]?.id || ''}`}
              className={`block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 ${
                !course.chapters[0] ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              Preview First Chapter
            </Link>
          </div>
        </div>
      </div>

      <ChaptersList courseId={course.id} chapters={course.chapters} />
    </div>
  );
}
