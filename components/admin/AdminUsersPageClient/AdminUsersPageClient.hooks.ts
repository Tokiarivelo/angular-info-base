import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  role: 'USER' | 'ADMIN';
  image: string | null;
  createdAt: string;
  _count: {
    CourseEnrollment: number;
    Checklist: number;
    QuizSubmission: number;
  };
}

async function fetchUsers(): Promise<AdminUser[]> {
  const response = await fetch('/api/admin/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

async function impersonateUser(userId: string | null) {
  const response = await fetch('/api/admin/impersonate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to impersonate user');
  }

  return response.json();
}

export function useAdminUsers() {
  const router = useRouter();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: fetchUsers,
  });

  const impersonateMutation = useMutation({
    mutationFn: impersonateUser,
    onSuccess: () => {
      // Redirect to courses page to see the user's view
      router.push('/courses');
      router.refresh();
    },
  });

  const handleImpersonate = (userId: string) => {
    impersonateMutation.mutate(userId);
  };

  return {
    users,
    isLoading,
    error,
    handleImpersonate,
    isImpersonating: impersonateMutation.isPending,
  };
}
