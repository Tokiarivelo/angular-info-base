export interface CourseRequest {
  id: string;
  title: string;
  description: string | null;
  reason: string | null;
  status: string;
  createdAt: Date | string;
  User: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export interface CourseRequestsListProps {
  requests: CourseRequest[];
}
