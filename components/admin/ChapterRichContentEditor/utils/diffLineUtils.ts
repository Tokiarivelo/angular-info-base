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

/** Prefix characters for each diff type */
export const DIFF_PREFIX_MAP: Record<string, string> = {
  added: '+',
  removed: '-',
  changed: '!',
  chunk: '@@ ',
};

/**
 * Strips any existing diff prefix from a line.
 * Handles: +, -, !, @@ ... @@, --- ..., +++ ...
 */
export function stripDiffPrefix(line: string): string {
  // Chunk header: @@ ... @@ optional text
  if (/^@@\s.*@@\s?/.test(line)) {
    return line.replace(/^@@\s.*@@\s?/, '');
  }
  // Simple @@ prefix
  if (line.startsWith('@@ ')) {
    return line.slice(3);
  }
  // Meta lines (--- / +++)
  if (/^\+\+\+\s/.test(line)) return line.slice(4);
  if (/^---\s/.test(line)) return line.slice(4);
  // Single prefix: +, -, !
  if (/^[+\-!]/.test(line)) return line.slice(1);
  return line;
}

/**
 * Applies a diff prefix to an array of lines.
 * If all lines already have the given prefix, it toggles them off.
 * If lines have a different prefix, it replaces with the new one.
 *
 * @returns The modified lines joined by newline.
 */
export function applyDiffPrefixToLines(
  lines: string[],
  diffType: string
): string[] {
  const prefix = DIFF_PREFIX_MAP[diffType];
  if (!prefix) return lines;

  // Check if all lines already have this prefix (toggle off)
  const allHavePrefix = lines.every((line) => {
    if (diffType === 'chunk') return line.startsWith('@@ ');
    return (
      line.startsWith(prefix) &&
      !line.startsWith('---') &&
      !line.startsWith('+++')
    );
  });

  return lines.map((line) => {
    if (allHavePrefix) {
      return stripDiffPrefix(line);
    }
    const stripped = stripDiffPrefix(line);
    if (diffType === 'chunk') {
      return `@@ ${stripped} @@`;
    }
    return `${prefix}${stripped}`;
  });
}
