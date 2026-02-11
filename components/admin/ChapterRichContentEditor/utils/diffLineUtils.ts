/**
 * Diff line classification utility used by CodeBlockEditor
 * and ChapterContentPanel for IDE-style diff highlighting.
 *
 * Extracted for testability and reuse.
 */

/** CSS class for the admin-side editor (Prism-based) */
export type DiffLineType =
  | 'added'
  | 'removed'
  | 'changed'
  | 'chunk'
  | 'meta'
  | 'context';

/**
 * Classifies a diff line based on its prefix character.
 */
export function classifyDiffLine(line: string): DiffLineType {
  const trimmed = line.trimStart();
  if (trimmed.startsWith('@@')) return 'chunk';
  if (trimmed.startsWith('+++') || trimmed.startsWith('---')) return 'meta';
  if (trimmed.startsWith('+')) return 'added';
  if (trimmed.startsWith('-')) return 'removed';
  if (trimmed.startsWith('!')) return 'changed';
  return 'context';
}

const EDITOR_CLASS_MAP: Record<DiffLineType, string> = {
  added: 'diff-line-added',
  removed: 'diff-line-removed',
  changed: 'diff-line-changed',
  chunk: 'diff-line-chunk',
  meta: 'diff-line-meta',
  context: '',
};

const READER_CLASS_MAP: Record<DiffLineType, string> = {
  added: 'diff-reader-line-added',
  removed: 'diff-reader-line-removed',
  changed: 'diff-reader-line-changed',
  chunk: 'diff-reader-line-chunk',
  meta: 'diff-reader-line-meta',
  context: '',
};

/**
 * Returns the CSS class for the admin editor (Prism-based).
 */
export function getEditorDiffLineClass(line: string): string {
  return EDITOR_CLASS_MAP[classifyDiffLine(line)];
}

/**
 * Returns the CSS class for the reader view (react-syntax-highlighter).
 */
export function getReaderDiffLineClass(line: string): string {
  return READER_CLASS_MAP[classifyDiffLine(line)];
}
