import { z } from 'zod';

export const createChapterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  order: z.number().int().min(0, 'Order must be a positive number'),
});

export type CreateChapterFormData = z.infer<typeof createChapterSchema>;

export const courseEditSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

export type CourseEditFormData = z.infer<typeof courseEditSchema>;
