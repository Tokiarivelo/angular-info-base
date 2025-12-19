'use client';

import { useQuery } from '@tanstack/react-query';
import { notFound, useRouter } from 'next/navigation';
import { Checklist } from '@/types/checklist.types';

async function fetchChecklist(id: string): Promise<Checklist> {
  const response = await fetch(`/api/checklists/${id}`);

  if (response.status === 404) {
    throw new Error('NOT_FOUND');
  }

  if (response.status === 403) {
    throw new Error('UNAUTHORIZED');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch checklist');
  }

  return response.json();
}

export function useChecklistDetail(id: string) {
  const router = useRouter();

  const {
    data: checklist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['checklist', id],
    queryFn: () => fetchChecklist(id),
  });

  if (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === 'NOT_FOUND') {
      notFound();
    }
    if (errorMessage === 'UNAUTHORIZED') {
      router.push('/checklist');
    }
  }

  return {
    checklist,
    isLoading,
    error,
  };
}
