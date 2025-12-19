import { Course } from '@/types/course.types';

export interface Chapter {
  id: string;
  title: string;
  order: number;
}

export interface CourseWithChapters extends Course {
  Chapter: Chapter[];
  _count?: {
    Chapter: number;
  };
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  Course: CourseWithChapters;
}

export interface EnrollmentRequest {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  createdAt: string;
  Course: Course;
}

export interface CourseRequest {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
}
