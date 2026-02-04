import { render, screen, fireEvent } from '@testing-library/react';
import CourseRequestsList from './CourseRequestsList';
import { useCourseRequestsList } from './CourseRequestsList.hooks';
import { CourseRequest } from './CourseRequestsList.types';

// Mock dependencies
jest.mock('@/lib/actions', () => ({
  reviewCourseRequest: jest.fn(),
}));
jest.mock('./CourseRequestsList.hooks');
jest.mock('lucide-react', () => ({
  Check: () => <span data-testid="icon-check" />,
  X: () => <span data-testid="icon-x" />,
  Clock: () => <span data-testid="icon-clock" />,
  HelpCircle: () => <span data-testid="icon-help" />,
  User: () => <span data-testid="icon-user" />,
  Calendar: () => <span data-testid="icon-calendar" />,
  FileText: () => <span data-testid="icon-file" />,
  Activity: () => <span data-testid="icon-activity" />,
}));

describe('CourseRequestsList', () => {
  const mockHandleReview = jest.fn();

  const mockPendingRequest: CourseRequest = {
    id: 'req-1',
    title: 'Pending Course',
    description: 'Description 1',
    reason: 'Reason 1',
    status: 'PENDING',
    createdAt: new Date('2023-01-01T12:00:00'),
    User: { id: 'u1', name: 'User 1', email: 'user1@example.com' },
  };

  const mockInProgressRequest: CourseRequest = {
    id: 'req-2',
    title: 'In Progress Course',
    description: null,
    reason: null,
    status: 'IN_PROGRESS',
    createdAt: new Date('2023-01-02T12:00:00'),
    User: { id: 'u2', name: 'User 2', email: 'user2@example.com' },
  };

  const mockReviewedRequest: CourseRequest = {
    id: 'req-3',
    title: 'Approved Course',
    description: null,
    reason: null,
    status: 'APPROVED',
    createdAt: new Date('2023-01-03T12:00:00'),
    User: { id: 'u3', name: 'User 3', email: 'user3@example.com' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pending requests', () => {
    (useCourseRequestsList as jest.Mock).mockReturnValue({
      isPending: false,
      handleReview: mockHandleReview,
      pendingRequests: [mockPendingRequest],
      inProgressRequests: [],
      reviewedRequests: [],
    });

    render(<CourseRequestsList requests={[mockPendingRequest]} />);

    expect(screen.getByText('Pending Review (1)')).toBeInTheDocument();
    expect(screen.getByText('Pending Course')).toBeInTheDocument();
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });

  it('renders in progress requests', () => {
    (useCourseRequestsList as jest.Mock).mockReturnValue({
      isPending: false,
      handleReview: mockHandleReview,
      pendingRequests: [],
      inProgressRequests: [mockInProgressRequest],
      reviewedRequests: [],
    });

    render(<CourseRequestsList requests={[mockInProgressRequest]} />);

    expect(screen.getByText('Processing (1)')).toBeInTheDocument();
    expect(screen.getByText('In Progress Course')).toBeInTheDocument();
  });

  it('renders reviewed requests', () => {
    (useCourseRequestsList as jest.Mock).mockReturnValue({
      isPending: false,
      handleReview: mockHandleReview,
      pendingRequests: [],
      inProgressRequests: [],
      reviewedRequests: [mockReviewedRequest],
    });

    render(<CourseRequestsList requests={[mockReviewedRequest]} />);

    expect(screen.getByText('History (1)')).toBeInTheDocument();
    expect(screen.getByText('Approved Course')).toBeInTheDocument();
    expect(screen.getByText('APPROVED')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    (useCourseRequestsList as jest.Mock).mockReturnValue({
      isPending: false,
      handleReview: mockHandleReview,
      pendingRequests: [],
      inProgressRequests: [],
      reviewedRequests: [],
    });

    render(<CourseRequestsList requests={[]} />);

    expect(screen.getByText('No course requests found.')).toBeInTheDocument();
  });

  it('calls handleReview when action buttons are clicked', () => {
    (useCourseRequestsList as jest.Mock).mockReturnValue({
      isPending: false,
      handleReview: mockHandleReview,
      pendingRequests: [mockPendingRequest],
      inProgressRequests: [],
      reviewedRequests: [],
    });

    render(<CourseRequestsList requests={[mockPendingRequest]} />);

    const approveButton = screen.getByText('Approve');
    fireEvent.click(approveButton);

    expect(mockHandleReview).toHaveBeenCalledWith('req-1', 'APPROVED');
  });

  it('handles string dates correctly', () => {
    const mockStringDateRequest: CourseRequest = {
      ...mockPendingRequest,
      createdAt: '2023-01-01T12:00:00.000Z',
    };

    (useCourseRequestsList as jest.Mock).mockReturnValue({
      isPending: false,
      handleReview: mockHandleReview,
      pendingRequests: [mockStringDateRequest],
      inProgressRequests: [],
      reviewedRequests: [],
    });

    render(<CourseRequestsList requests={[mockStringDateRequest]} />);
    // Should handle the display without error
    expect(screen.getByText(/2023/)).toBeInTheDocument();
  });
});
