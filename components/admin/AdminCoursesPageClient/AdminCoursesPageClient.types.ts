export interface Course {
  id: string;
  title: string;
  description: string | null;
  _count: {
    Chapter: number;
    CourseEnrollment: number;
  };
}
