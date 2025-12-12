'use client';

import { useTransition, useState } from 'react';
import { updateCourse, deleteCourse } from '@/lib/actions';
import { useRouter } from 'next/navigation';

interface Course {
  id: string;
  title: string;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CourseEditFormProps {
  course: Course;
}

export default function CourseEditForm({ course }: CourseEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await updateCourse(course.id, formData);
      } catch (error) {
        console.error('Failed to update course:', error);
      }
    });
  };

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this course? This will also delete all chapters and related data.'
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCourse(course.id);
      router.push('/admin/courses');
    } catch (error) {
      console.error('Failed to delete course:', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Course Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={course.title}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={course.description || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Course'}
          </button>
        </div>
      </form>
    </div>
  );
}
