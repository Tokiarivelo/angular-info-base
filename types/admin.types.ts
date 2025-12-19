import { z } from 'zod';
import { BaseEntity } from './shared.types';

// Admin-specific types

export interface CourseRequest extends BaseEntity {
  userId: string;
  title: string;
  description: string | null;
  reason: string | null;
  status: RequestStatus;
}

export interface EnrollmentRequest extends BaseEntity {
  userId: string;
  courseId: string;
  status: RequestStatus;
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Chapter extends BaseEntity {
  courseId: string;
  title: string;
  content: string | null;
  order: number;
}
