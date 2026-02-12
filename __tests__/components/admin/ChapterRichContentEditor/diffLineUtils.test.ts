import {
  classifyDiffLine,
  getEditorDiffLineClass,
  getReaderDiffLineClass,
  stripDiffPrefix,
  applyDiffPrefixToLines,
} from '@/components/admin/ChapterRichContentEditor/utils/diffLineUtils';

describe('diffLineUtils', () => {
  describe('classifyDiffLine', () => {
    it('should classify added lines starting with +', () => {
      expect(classifyDiffLine('+ const x = 1;')).toBe('added');
      expect(classifyDiffLine('+added line')).toBe('added');
    });

    it('should classify removed lines starting with -', () => {
      expect(classifyDiffLine('- const x = 1;')).toBe('removed');
      expect(classifyDiffLine('-removed line')).toBe('removed');
    });

    it('should classify changed lines starting with !', () => {
      expect(classifyDiffLine('! changed line')).toBe('changed');
    });

    it('should classify chunk headers starting with @@', () => {
      expect(classifyDiffLine('@@ -1,5 +1,7 @@')).toBe('chunk');
      expect(classifyDiffLine('@@ -10,3 +12,5 @@ function foo()')).toBe(
        'chunk'
      );
    });

    it('should classify meta lines (--- and +++)', () => {
      expect(classifyDiffLine('--- a/file.ts')).toBe('meta');
      expect(classifyDiffLine('+++ b/file.ts')).toBe('meta');
    });

    it('should classify context lines (no prefix)', () => {
      expect(classifyDiffLine('  unchanged line')).toBe('context');
      expect(classifyDiffLine('context line')).toBe('context');
      expect(classifyDiffLine('')).toBe('context');
    });

    it('should handle lines with leading whitespace before prefix', () => {
      expect(classifyDiffLine('  +added with indent')).toBe('added');
      expect(classifyDiffLine('  -removed with indent')).toBe('removed');
      expect(classifyDiffLine('  @@ chunk with indent')).toBe('chunk');
    });
  });

  describe('getEditorDiffLineClass', () => {
    it('should return correct editor CSS classes', () => {
      expect(getEditorDiffLineClass('+added')).toBe('diff-line-added');
      expect(getEditorDiffLineClass('-removed')).toBe('diff-line-removed');
      expect(getEditorDiffLineClass('!changed')).toBe('diff-line-changed');
      expect(getEditorDiffLineClass('@@ chunk')).toBe('diff-line-chunk');
      expect(getEditorDiffLineClass('--- meta')).toBe('diff-line-meta');
    });

    it('should return empty string for context lines', () => {
      expect(getEditorDiffLineClass('context')).toBe('');
      expect(getEditorDiffLineClass('')).toBe('');
    });
  });

  describe('getReaderDiffLineClass', () => {
    it('should return correct reader CSS classes', () => {
      expect(getReaderDiffLineClass('+added')).toBe('diff-reader-line-added');
      expect(getReaderDiffLineClass('-removed')).toBe(
        'diff-reader-line-removed'
      );
      expect(getReaderDiffLineClass('!changed')).toBe(
        'diff-reader-line-changed'
      );
      expect(getReaderDiffLineClass('@@ chunk')).toBe('diff-reader-line-chunk');
      expect(getReaderDiffLineClass('--- meta')).toBe('diff-reader-line-meta');
    });

    it('should return empty string for context lines', () => {
      expect(getReaderDiffLineClass('context')).toBe('');
      expect(getReaderDiffLineClass('')).toBe('');
    });
  });

  describe('meta vs added/removed disambiguation', () => {
    it('should classify +++ as meta, not added', () => {
      expect(classifyDiffLine('+++ b/file.ts')).toBe('meta');
    });

    it('should classify --- as meta, not removed', () => {
      expect(classifyDiffLine('--- a/file.ts')).toBe('meta');
    });

    it('should classify single + as added', () => {
      expect(classifyDiffLine('+single plus')).toBe('added');
    });

    it('should classify single - as removed', () => {
      expect(classifyDiffLine('-single minus')).toBe('removed');
    });

    it('should classify ++ (double plus) as added', () => {
      expect(classifyDiffLine('++double plus')).toBe('added');
    });

    it('should classify -- (double minus) as removed', () => {
      expect(classifyDiffLine('--double minus')).toBe('removed');
    });
  });

  describe('stripDiffPrefix', () => {
    it('should strip + prefix from added lines', () => {
      expect(stripDiffPrefix('+const x = 1;')).toBe('const x = 1;');
    });

    it('should strip - prefix from removed lines', () => {
      expect(stripDiffPrefix('-const x = 1;')).toBe('const x = 1;');
    });

    it('should strip ! prefix from changed lines', () => {
      expect(stripDiffPrefix('!changed line')).toBe('changed line');
    });

    it('should strip @@ chunk header with content', () => {
      expect(stripDiffPrefix('@@ -1,5 +1,7 @@ function foo()')).toBe(
        'function foo()'
      );
    });

    it('should strip simple @@ prefix', () => {
      expect(stripDiffPrefix('@@ some text')).toBe('some text');
    });

    it('should strip +++ meta prefix', () => {
      expect(stripDiffPrefix('+++ b/file.ts')).toBe('b/file.ts');
    });

    it('should strip --- meta prefix', () => {
      expect(stripDiffPrefix('--- a/file.ts')).toBe('a/file.ts');
    });

    it('should return unchanged context lines', () => {
      expect(stripDiffPrefix('context line')).toBe('context line');
      expect(stripDiffPrefix('  indented line')).toBe('  indented line');
      expect(stripDiffPrefix('')).toBe('');
    });
  });

  describe('applyDiffPrefixToLines', () => {
    it('should apply + prefix to plain lines', () => {
      const result = applyDiffPrefixToLines(
        ['const x = 1;', 'const y = 2;'],
        'added'
      );
      expect(result).toEqual(['+const x = 1;', '+const y = 2;']);
    });

    it('should apply - prefix to plain lines', () => {
      const result = applyDiffPrefixToLines(['line1', 'line2'], 'removed');
      expect(result).toEqual(['-line1', '-line2']);
    });

    it('should apply ! prefix to plain lines', () => {
      const result = applyDiffPrefixToLines(['line1'], 'changed');
      expect(result).toEqual(['!line1']);
    });

    it('should apply @@ chunk wrapper', () => {
      const result = applyDiffPrefixToLines(['function foo()'], 'chunk');
      expect(result).toEqual(['@@ function foo() @@']);
    });

    it('should replace existing prefix with new one', () => {
      const result = applyDiffPrefixToLines(['+added line'], 'removed');
      expect(result).toEqual(['-added line']);
    });

    it('should toggle off when all lines already have the same prefix', () => {
      const result = applyDiffPrefixToLines(['+line1', '+line2'], 'added');
      expect(result).toEqual(['line1', 'line2']);
    });

    it('should toggle off chunk prefix', () => {
      // '@@ header @@' -> stripDiffPrefix removes the @@ ... @@ wrapper
      const result = applyDiffPrefixToLines(['@@ header @@'], 'chunk');
      expect(result).toEqual(['']);
    });

    it('should toggle off chunk with trailing content', () => {
      const result = applyDiffPrefixToLines(
        ['@@ -1,5 +1,7 @@ function foo()'],
        'chunk'
      );
      expect(result).toEqual(['function foo()']);
    });

    it('should not toggle off if only some lines have the prefix', () => {
      const result = applyDiffPrefixToLines(['+line1', 'line2'], 'added');
      expect(result).toEqual(['+line1', '+line2']);
    });

    it('should return lines unchanged for unknown diff type', () => {
      const result = applyDiffPrefixToLines(['line1'], 'unknown');
      expect(result).toEqual(['line1']);
    });
  });
});
