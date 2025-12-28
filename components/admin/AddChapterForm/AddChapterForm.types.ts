import {
  createChapterSchema,
  CreateChapterFormData,
} from '../schemas/admin.schemas';

export interface AddChapterFormProps {
  courseId: string;
}

export { createChapterSchema };
export type { CreateChapterFormData };
