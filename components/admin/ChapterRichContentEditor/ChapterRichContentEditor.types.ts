export type BlockType = 'richText' | 'proTip' | 'image' | 'code' | 'separator';

export interface EditorBlock {
  id: string;
  type: BlockType;
  content: string;
  title?: string;
}

export interface Chapter {
  id: string;
  title: string;
  description?: string | null;
  content?: EditorBlock[]; // Flexible content blocks
  // Deprecated fields kept for backward compatibility if needed
  introText?: string | null;
  proTips?: any;
  instructions?: any;
}

export interface ChapterRichContentEditorProps {
  chapter: Chapter;
  onSave: (data: { content: EditorBlock[] }) => Promise<void>;
}
