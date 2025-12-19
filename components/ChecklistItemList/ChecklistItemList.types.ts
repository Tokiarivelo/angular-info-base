export interface ChecklistItemType {
  id: string;
  title: string;
  done: boolean;
  notes: string | null;
  updatedAt?: Date | string;
}

export interface ChecklistItemListProps {
  items: ChecklistItemType[];
}

export interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string, currentDone: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
  isProcessing: boolean;
}
