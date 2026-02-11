'use client';

import { useEffect } from 'react';
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

import { getEditorDiffLineClass } from '../utils/diffLineUtils';

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
 * When language is 'diff', each line is individually wrapped in a span
 * with background colors matching IDE conventions.
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

/**
 * Escapes HTML entities to prevent XSS.
 */
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

  useEffect(() => {
    // Ensure Prism is loaded
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

      {/* Diff legend when in diff mode */}
      {language === 'diff' && (
        <div className="flex items-center gap-3 px-3 py-1.5 bg-[#252526] border-b border-[#3e3e42]">
          <span className="flex items-center gap-1.5 text-[10px] font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#2ea04370]" />
            <span className="text-[#3fb950]">{t('diffLegend.added')}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#f8514970]" />
            <span className="text-[#f85149]">{t('diffLegend.removed')}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#d29922]/30" />
            <span className="text-[#d29922]">{t('diffLegend.changed')}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#58a6ff]/20" />
            <span className="text-[#58a6ff]">{t('diffLegend.chunk')}</span>
          </span>
        </div>
      )}

      {/* Code Editor with Syntax Highlighting */}
      <div className="code-block-editor-wrapper">
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
