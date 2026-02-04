import { Course } from '@/types/course.types';

export interface ChapterSummary {
  id: string;
  title: string;
  order: number;
}

export interface CourseWithCount extends Course {
  Chapter?: ChapterSummary[];
  _count?: {
    Chapter?: number;
    chapters?: number;
  };
}

export interface CoursesPageClientProps {
  allCourses: CourseWithCount[];
  enrolledCourseIds: string[];
  requestedCourseIds: string[];
}
