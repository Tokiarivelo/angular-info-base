'use client';

import { ChecklistListProps } from './ChecklistList.types';
import { useChecklistDelete } from './ChecklistList.hooks';
import ChecklistCard from './ChecklistCard';
import EmptyState from './EmptyState';

export default function ChecklistList({ checklists }: ChecklistListProps) {
  const { handleDelete, isDeleting } = useChecklistDelete();

  if (checklists.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {checklists.map((checklist) => (
        <ChecklistCard
          key={checklist.id}
          checklist={checklist}
          onDelete={handleDelete}
          isDeleting={isDeleting(checklist.id)}
        />
      ))}
    </div>
  );
}
