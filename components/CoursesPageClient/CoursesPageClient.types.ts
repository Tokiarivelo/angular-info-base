import { Course } from '@/types/course.types';

export interface CoursesPageClientProps {
  allCourses: CourseWithCount[];
  enrolledCourseIds: string[];
  requestedCourseIds: string[];
}

export interface CourseWithCount extends Course {
  _count?: {
    Chapter?: number;
    chapters?: number;
  };
}
