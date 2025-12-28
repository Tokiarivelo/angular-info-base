export interface EnrollmentRequest {
  id: string;
  status: string;
  message: string | null;
  createdAt: Date | string;
  User: {
    id: string;
    name: string | null;
    email: string | null;
  };
  Course: {
    id: string;
    title: string;
  };
}

export interface EnrollmentRequestsListProps {
  requests: EnrollmentRequest[];
}
