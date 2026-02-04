export interface CourseCardProps {
  id: string;
  title: string;
  description: string | null;
  imageUrl?: string | null;
  chaptersCount?: number;
  isEnrolled?: boolean;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS';
  nextChapter?: {
    id: string;
    title: string;
    order: number;
    progress?: number;
  };
}
