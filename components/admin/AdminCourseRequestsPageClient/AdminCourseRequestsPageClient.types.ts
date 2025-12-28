export interface CourseRequest {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  reason: string | null;
  status: string;
  createdAt: string;
  User: {
    id: string;
    name: string | null;
    email: string | null;
  };
}
