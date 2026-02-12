'use client';

import { useEffect, useRef, useCallback } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import { useTranslations } from 'next-intl';

// Import Prism themes and languages
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-diff';

import {
  getEditorDiffLineClass,
  applyDiffPrefixToLines,
  DIFF_PREFIX_MAP,
} from '../utils/diffLineUtils';

interface CodeBlockEditorProps {
  blockId: string;
  content: string;
  language: string;
  onUpdate: (
    blockId: string,
    data: { content?: string; title?: string }
  ) => void;
}

const languageMap: Record<string, string> = {
  typescript: 'typescript',
  javascript: 'javascript',
  html: 'markup',
  css: 'css',
  json: 'json',
  bash: 'bash',
  diff: 'diff',
};

/**
 * Highlights code with diff-aware line coloring.
 */
function highlightWithDiff(code: string, language: string): string {
  const prismLanguage = languageMap[language] || 'typescript';

  if (prismLanguage === 'diff') {
    const lines = code.split('\n');
    return lines
      .map((line) => {
        const lineClass = getEditorDiffLineClass(line);
        const escaped = escapeHtml(line);
        if (lineClass) {
          return `<span class="${lineClass}">${escaped}</span>`;
        }
        return escaped;
      })
      .join('\n');
  }

  try {
    return Prism.highlight(code, Prism.languages[prismLanguage], prismLanguage);
  } catch {
    return escapeHtml(code);
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default function CodeBlockEditor({
  blockId,
  content,
  language,
  onUpdate,
}: CodeBlockEditorProps) {
  const t = useTranslations('richContentEditor');
  const editorWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Prism.highlightAll();
    }
  }, [content, language]);

  const handleCodeChange = (code: string) => {
    onUpdate(blockId, { content: code });
  };

  const handleLanguageChange = (newLanguage: string) => {
    onUpdate(blockId, { title: newLanguage });
  };

  /**
   * Gets the hidden textarea from react-simple-code-editor.
   */
  const getTextarea = useCallback((): HTMLTextAreaElement | null => {
    if (!editorWrapperRef.current) return null;
    return editorWrapperRef.current.querySelector('textarea');
  }, []);

  /**
   * Applies a diff prefix to the line(s) at the current cursor/selection.
   * If the line already has this prefix, it toggles it off.
   * If the line has a different prefix, it replaces it.
   */
  const applyDiffPrefix = useCallback(
    (diffType: string) => {
      const textarea = getTextarea();
      if (!textarea) return;

      const { selectionStart, selectionEnd } = textarea;
      const text = content || '';
      const prefix = DIFF_PREFIX_MAP[diffType];
      if (!prefix) return;

      // Find the line range covered by the selection
      const beforeSelection = text.slice(0, selectionStart);
      const firstLineStart =
        beforeSelection.lastIndexOf('\n') === -1
          ? 0
          : beforeSelection.lastIndexOf('\n') + 1;

      const afterSelectionEnd = text.indexOf('\n', selectionEnd);
      const lastLineEnd =
        afterSelectionEnd === -1 ? text.length : afterSelectionEnd;

      // Get the affected lines and apply prefix
      const selectedText = text.slice(firstLineStart, lastLineEnd);
      const lines = selectedText.split('\n');
      const newLines = applyDiffPrefixToLines(lines, diffType);
      const newSelectedText = newLines.join('\n');
      const newContent =
        text.slice(0, firstLineStart) +
        newSelectedText +
        text.slice(lastLineEnd);

      onUpdate(blockId, { content: newContent });

      // Restore cursor position after React re-render
      const lengthDiff = newSelectedText.length - selectedText.length;
      requestAnimationFrame(() => {
        const ta = getTextarea();
        if (ta) {
          const newEnd = selectionEnd + lengthDiff;
          ta.focus();
          ta.setSelectionRange(
            Math.min(selectionStart, newEnd),
            Math.max(selectionStart, newEnd)
          );
        }
      });
    },
    [content, blockId, onUpdate, getTextarea]
  );

  return (
    <div className="space-y-0 rounded-md overflow-hidden border border-[#3e3e42] bg-[#1e1e1e]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#3e3e42]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#cccccc] uppercase tracking-wider">
            {t('codeEditor')}
          </span>
        </div>
        <select
          value={language || 'typescript'}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="text-xs bg-[#3c3c3c] text-[#cccccc] border border-[#3c3c3c] rounded px-2 py-1 outline-none focus:border-[#007acc] transition-colors"
        >
          <option value="typescript">TypeScript</option>
          <option value="javascript">JavaScript</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="json">JSON</option>
          <option value="bash">Bash</option>
          <option value="diff">Diff</option>
        </select>
      </div>

      {/* Diff toolbar — clickable legend buttons */}
      {language === 'diff' && (
        <div className="flex items-center gap-1 px-3 py-1.5 bg-[#252526] border-b border-[#3e3e42]">
          <span className="text-[10px] text-gray-500 mr-1 select-none">
            {t('diffLegend.applyHint')}
          </span>
          <button
            type="button"
            onClick={() => applyDiffPrefix('added')}
            className="diff-toolbar-btn flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium
              bg-[#2ea043]/10 hover:bg-[#2ea043]/25 text-[#3fb950]
              border border-[#2ea043]/20 hover:border-[#2ea043]/50
              transition-all duration-150 cursor-pointer active:scale-95"
            title={t('diffLegend.addedTooltip')}
          >
            <span className="inline-block w-2 h-2 rounded-sm bg-[#2ea04370]" />
            {t('diffLegend.added')}
          </button>
          <button
            type="button"
            onClick={() => applyDiffPrefix('removed')}
            className="diff-toolbar-btn flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium
              bg-[#f85149]/10 hover:bg-[#f85149]/25 text-[#f85149]
              border border-[#f85149]/20 hover:border-[#f85149]/50
              transition-all duration-150 cursor-pointer active:scale-95"
            title={t('diffLegend.removedTooltip')}
          >
            <span className="inline-block w-2 h-2 rounded-sm bg-[#f8514970]" />
            {t('diffLegend.removed')}
          </button>
          <button
            type="button"
            onClick={() => applyDiffPrefix('changed')}
            className="diff-toolbar-btn flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium
              bg-[#d29922]/10 hover:bg-[#d29922]/25 text-[#d29922]
              border border-[#d29922]/20 hover:border-[#d29922]/50
              transition-all duration-150 cursor-pointer active:scale-95"
            title={t('diffLegend.changedTooltip')}
          >
            <span className="inline-block w-2 h-2 rounded-sm bg-[#d29922]/30" />
            {t('diffLegend.changed')}
          </button>
          <button
            type="button"
            onClick={() => applyDiffPrefix('chunk')}
            className="diff-toolbar-btn flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium
              bg-[#58a6ff]/10 hover:bg-[#58a6ff]/25 text-[#58a6ff]
              border border-[#58a6ff]/20 hover:border-[#58a6ff]/50
              transition-all duration-150 cursor-pointer active:scale-95"
            title={t('diffLegend.chunkTooltip')}
          >
            <span className="inline-block w-2 h-2 rounded-sm bg-[#58a6ff]/20" />
            {t('diffLegend.chunk')}
          </button>
        </div>
      )}

      {/* Code Editor with Syntax Highlighting */}
      <div className="code-block-editor-wrapper" ref={editorWrapperRef}>
        <Editor
          value={content || ''}
          onValueChange={handleCodeChange}
          highlight={(code) => highlightWithDiff(code, language)}
          padding={16}
          placeholder={
            language === 'diff'
              ? t('diffPlaceholder')
              : '// Write your code here...'
          }
          style={{
            fontFamily: "Menlo, Monaco, 'Courier New', monospace",
            fontSize: 14,
            backgroundColor: '#1e1e1e',
            minHeight: '200px',
          }}
          textareaClassName="code-block-textarea"
          preClassName="code-block-pre"
        />
      </div>
    </div>
  );
}
