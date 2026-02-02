'use client';

import { useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateCourse } from '@/lib/actions';
import { CourseEditFormProps } from './CourseEditForm.types';
import { useCourseDelete } from './CourseEditForm.hooks';
import { courseEditSchema, CourseEditFormData } from '../schemas/admin.schemas';
import CourseImageUpload from './components/CourseImageUpload';

export default function CourseEditForm({ course }: CourseEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const { handleCourseDelete, isDeleting } = useCourseDelete(course.id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseEditFormData>({
    resolver: zodResolver(courseEditSchema),
    defaultValues: {
      title: course.title,
      description: course.description || '',
      imageUrl: course.imageUrl || null,
    },
  });

  const imageUrl = watch('imageUrl');
  const title = watch('title');
  const description = watch('description');

  const onSubmit = async (data: CourseEditFormData) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('title', data.title);
        if (data.description) formData.append('description', data.description);
        if (data.imageUrl) formData.append('imageUrl', data.imageUrl);

        await updateCourse(course.id, formData);
        queryClient.invalidateQueries({ queryKey: ['adminCourse', course.id] });
      } catch (error) {
        console.error('Failed to update course:', error);
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Course</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <CourseImageUpload
          value={imageUrl}
          onChange={(url) => setValue('imageUrl', url)}
          title={title}
          description={description}
        />
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
            className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('title')}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
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
            rows={3}
            className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
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
            onClick={handleCourseDelete}
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
