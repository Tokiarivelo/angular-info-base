export interface Chapter {
  id: string;
  title: string;
  description: string | null;
  imageUrl?: string | null;
  order: number;
  _count: {
    Quiz: number;
    UserChapterProgress: number;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl?: string | null;
  Chapter: Chapter[];
  _count: {
    CourseEnrollment: number;
  };
}

export interface AdminCoursePageClientProps {
  id: string;
}
