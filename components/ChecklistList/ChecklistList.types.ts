export interface ChecklistWithItems {
  id: string;
  title: string;
  description: string | null;
  createdAt?: Date | string;
  items: Array<{
    id: string;
    done: boolean;
  }>;
}

export interface ChecklistListProps {
  checklists: ChecklistWithItems[];
}

export interface ChecklistCardProps {
  checklist: ChecklistWithItems;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}
