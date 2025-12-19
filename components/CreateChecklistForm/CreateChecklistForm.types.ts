import { z } from 'zod';

// Zod schema for checklist creation form
export const createChecklistSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
});

export type CreateChecklistFormData = z.infer<typeof createChecklistSchema>;

// Props for the CreateChecklistForm component
export interface CreateChecklistFormProps {
  // Component is self-contained, no props needed
}
