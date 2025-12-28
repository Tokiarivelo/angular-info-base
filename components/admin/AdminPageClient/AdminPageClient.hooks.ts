import { useQuery } from '@tanstack/react-query';
import { AdminStats } from './AdminPageClient.types';

async function fetchAdminStats(): Promise<AdminStats> {
  const response = await fetch('/api/admin/stats');

  if (!response.ok) {
    throw new Error('Failed to fetch admin stats');
  }

  return response.json();
}

export function useAdminPage() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchAdminStats,
  });

  return { stats, isLoading, error };
}
