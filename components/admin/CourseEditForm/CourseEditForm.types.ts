import { Course, CourseEditFormData } from '@/types/course.types';

// Props for the CourseEditForm component
export interface CourseEditFormProps {
  course: Course;
}

// Re-export form data type from shared types
export type { CourseEditFormData };
