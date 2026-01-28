export type BlockType = 'richText' | 'proTip' | 'image' | 'code' | 'separator';

/**
 * Defines which block types can be converted to other types.
 * The key is the source type, and the value is an array of target types it can convert to.
 */
export const BLOCK_TYPE_CONVERSIONS: Record<BlockType, BlockType[]> = {
  richText: ['proTip'], // Text can become a Pro Tip
  proTip: ['richText'], // Pro Tip can become regular text
  code: [], // Code blocks don't convert to other types
  image: [], // Image blocks don't convert to other types
  separator: [], // Separator blocks don't convert to other types
};

/**
 * Human-readable labels for block types
 */
export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  richText: 'Text',
  proTip: 'Pro Tip',
  code: 'Code',
  image: 'Image',
  separator: 'Separator',
};

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
