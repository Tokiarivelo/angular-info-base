import { z } from 'zod';
import { BaseEntity } from './shared.types';

// Course types and schemas

export interface Course extends BaseEntity {
  title: string;
  description: string | null;
  published?: boolean;
  imageUrl?: string | null;
}

export interface Enrollment extends BaseEntity {
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
}

export type EnrollmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Zod schemas for validation

export const courseRequestSchema = z.object({
  title: z
    .string()
    .min(1, 'Course title is required')
    .max(200, 'Title is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  reason: z.string().max(500, 'Reason is too long').optional(),
});

export type CourseRequestFormData = z.infer<typeof courseRequestSchema>;

export const courseEditSchema = z.object({
  title: z
    .string()
    .min(1, 'Course title is required')
    .max(200, 'Title is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
});

export type CourseEditFormData = z.infer<typeof courseEditSchema>;
