export interface EnrollmentRequest {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  message: string | null;
  createdAt: string;
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
