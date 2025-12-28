import { z } from 'zod';

export const chapterProgressSchema = z.object({
  repositoryUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  websiteUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
});

export type ChapterProgressFormData = z.infer<typeof chapterProgressSchema>;
