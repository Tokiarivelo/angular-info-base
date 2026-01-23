import { EditorBlock } from '../ChapterRichContentEditor/ChapterRichContentEditor.types';

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  content?: EditorBlock[]; // Flexible content blocks
  introText?: string | null; // Deprecated
  imageUrl?: string | null;
  proTips?: any; // Deprecated
  instructions?: any; // Deprecated
  livePreviewUrl?: string | null;
  order: number;
}

export interface ChapterEditModalProps {
  chapter?: Chapter | null; // Optional for creation mode
  courseId: string; // Required for creation
  isOpen: boolean;
  onClose: () => void;
  onSave: (chapterId: string | null, data: ChapterUpdateData) => Promise<void>;
}

export interface ChapterUpdateData {
  title: string;
  description?: string;
  content?: EditorBlock[];
  introText?: string;
  imageUrl?: string;
  proTips?: any;
  instructions?: any;
  livePreviewUrl?: string;
}

export interface ParsedContent {
  content: EditorBlock[];
}
