import { render, screen } from '@testing-library/react';
import AdminCoursePageClient from './AdminCoursePageClient';
import { useAdminCoursePage } from './AdminCoursePageClient.hooks';

// Mock dependencies
jest.mock('./AdminCoursePageClient.hooks');
jest.mock('@/components/admin/CourseEditForm', () => {
  return function MockCourseEditForm() {
    return <div data-testid="course-edit-form">Course Edit Form</div>;
  };
});
jest.mock('@/components/admin/ChaptersList', () => {
  return function MockChaptersList() {
    return <div data-testid="chapters-list">Chapters List</div>;
  };
});
jest.mock('next/link', () => {
  const MockLink = ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  );
  MockLink.displayName = 'Link';
  return MockLink;
});
jest.mock('lucide-react', () => ({
  ArrowLeft: () => <span>ArrowLeft</span>,
  BookOpen: () => <span>BookOpen</span>,
  Users: () => <span>Users</span>,
  PlayCircle: () => <span>PlayCircle</span>,
  Loader2: () => <span>Loader2</span>,
  AlertCircle: () => <span>AlertCircle</span>,
}));

describe('AdminCoursePageClient', () => {
  const mockCourse = {
    id: 'course-1',
    title: 'Test Course',
    description: 'Test Description',
    imageUrl: 'https://example.com/image.jpg',
    _count: {
      CourseEnrollment: 10,
    },
    Chapter: [
      {
        id: 'chapter-1',
        title: 'Chapter 1',
        description: 'Chapter 1 Description',
        order: 0,
        _count: {
          Quiz: 1,
          UserChapterProgress: 5,
        },
      },
    ],
  };

  it('renders loading state', () => {
    (useAdminCoursePage as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      course: null,
    });

    render(<AdminCoursePageClient id="course-1" />);
    expect(screen.getByText('Loading course details...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useAdminCoursePage as jest.Mock).mockReturnValue({
      isLoading: false,
      error: new Error('Failed to fetch'),
      course: null,
    });

    render(<AdminCoursePageClient id="course-1" />);
    expect(screen.getByText('Error Loading Course')).toBeInTheDocument();
  });

  it('renders course content', () => {
    (useAdminCoursePage as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      course: mockCourse,
    });

    render(<AdminCoursePageClient id="course-1" />);

    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // Enrollment count
    expect(screen.getByTestId('course-edit-form')).toBeInTheDocument();
    expect(screen.getByTestId('chapters-list')).toBeInTheDocument();

    // Check if image is rendered
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });
});
