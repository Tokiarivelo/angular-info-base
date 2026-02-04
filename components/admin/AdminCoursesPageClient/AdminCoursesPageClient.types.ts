export interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  _count: {
    Chapter: number;
    CourseEnrollment: number;
  };
}
