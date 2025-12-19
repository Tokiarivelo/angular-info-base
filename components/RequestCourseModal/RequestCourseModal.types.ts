import { CourseRequestFormData } from '@/types/course.types';

// Props for the RequestCourseModal component
export interface RequestCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Re-export the form data type from shared types
export type { CourseRequestFormData };
