import { useMemo } from 'react';
import { deleteChecklist } from '@/lib/actions';
import { useDelete } from '@/components/shared/hooks';
import { ChecklistWithItems } from './ChecklistList.types';

/**
 * Hook for calculating checklist progress
 */
export function useChecklistProgress(checklist: ChecklistWithItems) {
  return useMemo(() => {
    const completedCount = checklist.items.filter((item) => item.done).length;
    const totalCount = checklist.items.length;
    const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return {
      completedCount,
      totalCount,
      percentage: Math.round(percentage),
    };
  }, [checklist.items]);
}

/**
 * Hook for handling checklist deletion
 */
export function useChecklistDelete() {
  return useDelete<string>(async (id: string) => {
    await deleteChecklist(id);
  }, 'Are you sure you want to delete this checklist?');
}
