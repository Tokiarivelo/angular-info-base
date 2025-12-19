import { useQuery } from '@tanstack/react-query';
import {
  CourseWithChapters,
  CourseEnrollment,
  EnrollmentRequest,
  CourseRequest,
} from './CoursesPageClientWrapper.types';
import { CourseWithCount } from '@/components/CoursesPageClient/CoursesPageClient.types';

async function fetchEnrollments(): Promise<CourseEnrollment[]> {
  const response = await fetch('/api/courses/enrollments');
  if (!response.ok) throw new Error('Failed to fetch enrollments');
  return response.json();
}

async function fetchEnrollmentRequests(): Promise<EnrollmentRequest[]> {
  const response = await fetch('/api/courses/enrollment-requests');
  if (!response.ok) throw new Error('Failed to fetch enrollment requests');
  return response.json();
}

async function fetchCourseRequests(): Promise<CourseRequest[]> {
  const response = await fetch('/api/courses/course-requests');
  if (!response.ok) throw new Error('Failed to fetch course requests');
  return response.json();
}

async function fetchAllCourses(): Promise<CourseWithCount[]> {
  const response = await fetch('/api/courses');
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
}

export function useCoursesData() {
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollments'],
    queryFn: fetchEnrollments,
  });

  const { data: enrollmentRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['enrollmentRequests'],
    queryFn: fetchEnrollmentRequests,
  });

  const { data: courseRequests, isLoading: courseRequestsLoading } = useQuery({
    queryKey: ['courseRequests'],
    queryFn: fetchCourseRequests,
  });

  const { data: allCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchAllCourses,
  });

  const isLoading =
    enrollmentsLoading ||
    requestsLoading ||
    courseRequestsLoading ||
    coursesLoading;

  return {
    enrollments,
    enrollmentRequests,
    courseRequests,
    allCourses,
    isLoading,
  };
}
