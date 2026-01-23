import { ParsedContent } from './ChapterEditModal.types';
import { EditorBlock } from '../ChapterRichContentEditor/ChapterRichContentEditor.types';

/**
 * Generate a unique ID for blocks
 */
const generateId = (prefix: string = 'block') =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Parse CSV content to extract chapter rich content
 */
export function parseCSVContent(csvText: string): ParsedContent {
  const lines = csvText.trim().split('\n');
  const blocks: EditorBlock[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing (handles quoted fields)
    const fields = line
      .split(',')
      .map((field) => field.trim().replace(/^"|"$/g, ''));
    const [type, title, content, language] = fields;

    switch (type?.toLowerCase()) {
      case 'intro':
      case 'richtext':
        if (content) {
          // Convert inline Markdown to HTML
          const htmlContent = content
            .split('\n\n')
            .map((p) => `<p>${convertInlineMarkdown(p)}</p>`)
            .join('');

          blocks.push({
            id: generateId('intro'),
            type: 'richText',
            content: htmlContent,
          });
        }
        break;

      case 'tip':
      case 'protip':
        const htmlTipContent = content
          ? content
              .split('\n\n')
              .map((p) => `<p>${convertInlineMarkdown(p)}</p>`)
              .join('')
          : '';

        blocks.push({
          id: generateId('tip'),
          type: 'proTip',
          title: title || 'Pro Tip',
          content: htmlTipContent,
        });
        break;

      case 'code':
        blocks.push({
          id: generateId('code'),
          type: 'code',
          title: language || title || 'typescript',
          content: content || '',
        });
        break;

      case 'image':
        blocks.push({
          id: generateId('image'),
          type: 'image',
          title: title || '',
          content: content || '', // URL
        });
        break;

      case 'instruction':
        // Instructions are now just rich text blocks
        let instructionContent = `<h3>${convertInlineMarkdown(title || 'Step ' + i)}</h3>`;
        if (content) {
          instructionContent += content
            .split('\n\n')
            .map((p) => `<p>${convertInlineMarkdown(p)}</p>`)
            .join('');
        }

        blocks.push({
          id: generateId('instruction'),
          type: 'richText',
          content: instructionContent,
        });
        break;
    }
  }

  return { content: blocks };
}

/**
 * Convert inline Markdown formatting to HTML
 */
function convertInlineMarkdown(text: string): string {
  return (
    text
      // Bold: **text** or __text__
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      // Italic: *text* or _text_ (but not in middle of words)
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\b_(.+?)_\b/g, '<em>$1</em>')
      // Inline code: `code`
      .replace(/`(.+?)`/g, '<code>$1</code>')
      // Links: [text](url)
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
  );
}

/**
 * Convert Markdown lists to HTML
 */
function convertLists(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let inList: 'ul' | 'ol' | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ulMatch = line.match(/^[-*+]\s+(.+)$/);
    const olMatch = line.match(/^\d+\.\s+(.+)$/);

    if (ulMatch) {
      if (inList !== 'ul') {
        if (inList) result.push(`</${inList}>`);
        result.push('<ul>');
        inList = 'ul';
      }
      result.push(`<li>${convertInlineMarkdown(ulMatch[1])}</li>`);
    } else if (olMatch) {
      if (inList !== 'ol') {
        if (inList) result.push(`</${inList}>`);
        result.push('<ol>');
        inList = 'ol';
      }
      result.push(`<li>${convertInlineMarkdown(olMatch[1])}</li>`);
    } else {
      if (inList) {
        result.push(`</${inList}>`);
        inList = null;
      }
      if (line.trim()) {
        result.push(line);
      } else {
        // Preserve empty lines as line breaks
        result.push('');
      }
    }
  }

  if (inList) {
    result.push(`</${inList}>`);
  }

  return result.join('\n');
}

/**
 * Parse Markdown content to extract chapter rich content
 */
export function parseMarkdownContent(mdText: string): ParsedContent {
  const blocks: EditorBlock[] = [];

  // Split content by code blocks and images to create separate blocks
  const parts: Array<{
    type: 'text' | 'code' | 'image' | 'separator';
    content: string;
    meta?: any;
  }> = [];
  let currentText = '';
  let position = 0;

  // Regular expressions
  // Match code blocks with optional language, allowing for \r\n or \n line endings
  const codeBlockRegex = /```(\w+)?\s*\r?\n([\s\S]*?)```/g;
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const separatorRegex = /^(?:---+|\*\*\*+|___+)\s*$/gm; // Horizontal rules

  // Find all code blocks and images
  const matches: Array<{
    index: number;
    length: number;
    type: 'code' | 'image' | 'separator';
    data: any;
  }> = [];

  // Find code blocks
  let match;
  while ((match = codeBlockRegex.exec(mdText)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      type: 'code',
      data: { language: match[1] || 'typescript', code: match[2].trim() },
    });
  }

  // Find images
  while ((match = imageRegex.exec(mdText)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      type: 'image',
      data: { alt: match[1], url: match[2] },
    });
  }

  // Find separators
  while ((match = separatorRegex.exec(mdText)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      type: 'separator',
      data: {},
    });
  }

  // Sort matches by position
  matches.sort((a, b) => a.index - b.index);

  // Extract parts
  for (const m of matches) {
    // Add text before this match
    if (m.index > position) {
      const textContent = mdText.substring(position, m.index).trim();
      if (textContent) {
        parts.push({ type: 'text', content: textContent });
      }
    }

    // Add the match
    parts.push({ type: m.type, content: '', meta: m.data });
    position = m.index + m.length;
  }

  // Add remaining text
  if (position < mdText.length) {
    const textContent = mdText.substring(position).trim();
    if (textContent) {
      parts.push({ type: 'text', content: textContent });
    }
  }

  // If no special blocks found, treat entire content as text
  if (parts.length === 0 && mdText.trim()) {
    parts.push({ type: 'text', content: mdText.trim() });
  }

  // Convert parts to blocks
  for (const part of parts) {
    if (part.type === 'code') {
      blocks.push({
        id: generateId('code'),
        type: 'code',
        title: part.meta.language,
        content: part.meta.code,
      });
    } else if (part.type === 'image') {
      blocks.push({
        id: generateId('image'),
        type: 'image',
        title: part.meta.alt,
        content: part.meta.url,
      });
    } else if (part.type === 'separator') {
      blocks.push({
        id: generateId('separator'),
        type: 'separator',
        content: '',
      });
    } else {
      // Process text content - split by headers
      const textBlocks = parseTextContent(part.content);
      blocks.push(...textBlocks);
    }
  }

  return { content: blocks };
}

/**
 * Parse text content and split by headers
 */
function parseTextContent(text: string): EditorBlock[] {
  const blocks: EditorBlock[] = [];

  // Split by headers
  const sections = text.split(/^(#{1,6})\s+(.+)$/gm);

  // Process first section (before any headers)
  if (sections[0] && sections[0].trim()) {
    const content = processTextContent(sections[0].trim());
    if (content) {
      blocks.push({
        id: generateId('intro'),
        type: 'richText',
        content,
      });
    }
  }

  // Process remaining sections (header + content pairs)
  for (let i = 1; i < sections.length; i += 3) {
    const headerLevel = sections[i]?.length || 2;
    const headerText = sections[i + 1]?.trim() || '';
    const sectionContent = sections[i + 2]?.trim() || '';

    // Check for Pro Tips
    if (headerText.match(/^(Pro\s*)?Tip/i) || sectionContent.startsWith('> ')) {
      const title =
        headerText.replace(/^(Pro\s*)?Tip:?\s*/i, '').trim() || 'Pro Tip';
      const content = processTextContent(sectionContent.replace(/^>\s*/gm, ''));

      blocks.push({
        id: generateId('tip'),
        type: 'proTip',
        title,
        content,
      });
    } else {
      // Regular section
      const headerTag = `h${Math.min(headerLevel, 6)}`;
      const content = processTextContent(sectionContent);
      const fullContent = `<${headerTag}>${convertInlineMarkdown(headerText)}</${headerTag}>${content}`;

      blocks.push({
        id: generateId('section'),
        type: 'richText',
        content: fullContent,
      });
    }
  }

  return blocks;
}

/**
 * Process text content: convert inline formatting and preserve line breaks
 */
function processTextContent(text: string): string {
  if (!text) return '';

  // Split by double newlines to get paragraphs
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());

  return paragraphs
    .map((para) => {
      // Convert inline Markdown (bold, italic, code, links)
      // but keep list markers as-is for CKEditor to handle
      const lines = para
        .split('\n')
        .map((line) => convertInlineMarkdown(line.trim()));
      const content = lines.join('<br>');
      return `<p>${content}</p>`;
    })
    .join('');
}

/**
 * Read file and detect type, then parse accordingly
 */
export async function parseImportedFile(file: File): Promise<ParsedContent> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;

      try {
        if (file.name.endsWith('.csv')) {
          resolve(parseCSVContent(text));
        } else if (file.name.endsWith('.md')) {
          resolve(parseMarkdownContent(text));
        } else {
          reject(
            new Error('Unsupported file type. Please use .csv or .md files.')
          );
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
