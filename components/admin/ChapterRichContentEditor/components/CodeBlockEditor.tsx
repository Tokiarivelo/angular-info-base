'use client';

import { useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';

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
};

export default function CodeBlockEditor({
  blockId,
  content,
  language,
  onUpdate,
}: CodeBlockEditorProps) {
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

  const highlight = (code: string) => {
    const prismLanguage = languageMap[language] || 'typescript';
    try {
      return Prism.highlight(
        code,
        Prism.languages[prismLanguage],
        prismLanguage
      );
    } catch (error) {
      return code;
    }
  };

  return (
    <div className="space-y-0 rounded-md overflow-hidden border border-[#3e3e42] bg-[#1e1e1e]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#3e3e42]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#cccccc] uppercase tracking-wider">
            Code Editor
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
        </select>
      </div>

      {/* Code Editor with Syntax Highlighting */}
      <div className="code-block-editor-wrapper">
        <Editor
          value={content || ''}
          onValueChange={handleCodeChange}
          highlight={highlight}
          padding={16}
          placeholder="// Write your code here..."
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
