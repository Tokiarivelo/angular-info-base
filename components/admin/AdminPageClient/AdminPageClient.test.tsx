import { render, screen } from '@testing-library/react';
import AdminPageClient from './AdminPageClient';
import { useAdminPage } from './AdminPageClient.hooks';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('./AdminPageClient.hooks');
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      dashboard: 'Admin Dashboard',
      overview: 'Overview of platform activity and metrics',
      totalCourses: 'Total Courses',
      contentChapters: 'Content Chapters',
      activeUsers: 'Active Users',
      totalEnrollments: 'Total Enrollments',
      actionRequired: 'Action Required',
      pendingRequestsDescription:
        'There are pending requests waiting for your approval.',
      viewEnrollments: 'Enrollments',
      viewCourseRequests: 'Course Requests',
      manageCourses: 'Manage Courses',
      manageCoursesDesc: 'Create, edit, and organize curriculum content.',
      enrollmentRequests: 'Enrollment Requests',
      enrollmentRequestsDesc:
        'Review and approve student enrollment applications.',
      courseRequests: 'Course Requests',
      courseRequestsDesc: 'Review proposals for new courses from users.',
      userManagement: 'User Management',
      userManagementDesc:
        'View user profiles and manage platform access roles.',
      systemSettings: 'System Settings',
      systemSettingsDesc:
        'Configure API keys and external service integrations.',
      reloadDashboard: 'Reload Dashboard',
      errorLoading: 'Unable to load dashboard',
      errorDescription: 'We encountered an error fetching your analytics.',
    };
    return messages[key] || key;
  },
}));

jest.mock('lucide-react', () => ({
  LayoutDashboard: () => <span data-testid="icon-layout" />,
  BookOpen: () => <span data-testid="icon-book" />,
  FileText: () => <span data-testid="icon-file" />,
  Users: () => <span data-testid="icon-users" />,
  GraduationCap: () => <span data-testid="icon-grad" />,
  AlertCircle: () => <span data-testid="icon-alert" />,
  ArrowRight: () => <span data-testid="icon-arrow" />,
  Settings: () => <span data-testid="icon-settings" />,
  Plus: () => <span data-testid="icon-plus" />,
  Clock: () => <span data-testid="icon-clock" />,
  CheckCircle2: () => <span data-testid="icon-check" />,
  Shield: () => <span data-testid="icon-shield" />,
  Activity: () => <span data-testid="icon-activity" />,
}));
// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  );
});

describe('AdminPageClient', () => {
  const mockStats = {
    coursesCount: 10,
    chaptersCount: 50,
    usersCount: 100,
    enrollmentsCount: 200,
    pendingEnrollmentRequests: 5,
    pendingCourseRequests: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    (useAdminPage as jest.Mock).mockReturnValue({
      stats: null,
      isLoading: true,
      error: null,
    });

    render(<AdminPageClient />);
    // In the loading state, we have a pulse animation class.
    // We can check for the presence of the skeleton structure.
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error state correctly', () => {
    (useAdminPage as jest.Mock).mockReturnValue({
      stats: null,
      isLoading: false,
      error: new Error('Failed to fetch'),
    });

    render(<AdminPageClient />);
    expect(screen.getByText('Unable to load dashboard')).toBeInTheDocument();
    expect(screen.getByText('Reload Dashboard')).toBeInTheDocument();
  });

  it('renders dashboard with stats correctly', () => {
    (useAdminPage as jest.Mock).mockReturnValue({
      stats: mockStats,
      isLoading: false,
      error: null,
    });

    render(<AdminPageClient />);

    // Check Header
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();

    // Check Stats Cards Values
    expect(screen.getByText('10')).toBeInTheDocument(); // Courses
    expect(screen.getByText('50')).toBeInTheDocument(); // Chapters
    expect(screen.getByText('100')).toBeInTheDocument(); // Users
    expect(screen.getByText('200')).toBeInTheDocument(); // Enrollments

    // Check Links logic (StatCard refactor validation)

    // "Total Courses" should be a link
    const coursesLink = screen.getByRole('link', { name: /total courses/i });
    expect(coursesLink).toHaveAttribute('href', '/admin/courses');

    // "Content Chapters" is just a div (no href), so searching by role 'link' with this name should fail
    const chaptersLink = screen.queryByRole('link', {
      name: /content chapters/i,
    });
    expect(chaptersLink).not.toBeInTheDocument();
    // But the text should exist
    expect(screen.getByText('Content Chapters')).toBeInTheDocument();
  });

  it('renders pending requests alert when there are pending items', () => {
    (useAdminPage as jest.Mock).mockReturnValue({
      stats: mockStats,
      isLoading: false,
      error: null,
    });

    render(<AdminPageClient />);

    expect(screen.getByText('Action Required')).toBeInTheDocument();
    expect(screen.getByText('5 Enrollments')).toBeInTheDocument();
    expect(screen.getByText('2 Course Requests')).toBeInTheDocument();
  });

  it('renders quick action cards', () => {
    (useAdminPage as jest.Mock).mockReturnValue({
      stats: mockStats,
      isLoading: false,
      error: null,
    });

    render(<AdminPageClient />);
    expect(screen.getByText('Manage Courses')).toBeInTheDocument();
    expect(screen.getByText('Enrollment Requests')).toBeInTheDocument();
    expect(screen.getByText('Course Requests')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });
});
