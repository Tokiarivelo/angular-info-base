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
import { Save, Trash2, Layout, FileText, AlertCircle } from 'lucide-react';

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
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Layout className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          Edit Course Details
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          ID: {course.id.slice(0, 8)}...
        </span>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <CourseImageUpload
            value={imageUrl}
            onChange={(url) => setValue('imageUrl', url)}
            title={title}
            description={description}
          />

          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                <FileText className="w-4 h-4 text-gray-400" />
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                  errors.title
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
                }`}
                placeholder="e.g. Advanced Angular Masterclass"
                {...register('title')}
              />
              {errors.title && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5 animate-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-y min-h-[100px] ${
                  errors.description
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
                }`}
                placeholder="Describe what students will learn in this course..."
                {...register('description')}
              />
              {errors.description && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5 animate-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <button
              type="button"
              onClick={handleCourseDelete}
              disabled={isDeleting}
              className="w-full sm:w-auto px-5 py-2.5 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 dark:hover:border-red-800 rounded-xl font-medium transition-all disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Deleting...' : 'Delete Course'}
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto px-8 py-2.5 bg-gray-900 dark:bg-blue-600 text-white rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-blue-700 shadow-lg shadow-gray-900/20 dark:shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
