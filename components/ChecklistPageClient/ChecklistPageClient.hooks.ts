import { useQuery } from '@tanstack/react-query';
import { Checklist } from '@/types/checklist.types';

// We need to define the type for checklists including the items count or full items for the list
// Looking at ChecklistList.tsx, it expects items array.
// But the key type conflict before was simpler.
// The fetchChecklists usually returns Checklist[]
// Let's assume it returns Checklist[]

async function fetchChecklists(): Promise<Checklist[]> {
  const response = await fetch('/api/checklists');

  if (!response.ok) {
    throw new Error('Failed to fetch checklists');
  }

  return response.json();
}

export function useChecklists() {
  const {
    data: checklists,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['checklists'],
    queryFn: fetchChecklists,
  });

  return {
    checklists,
    isLoading,
    error,
  };
}
