/**
 * File parser utilities for CSV and Markdown files
 * Used to convert file contents into checklist items
 */

export interface ParsedChecklistItem {
  title: string;
  notes: string | null;
}

export interface ParsedChecklist {
  title: string;
  description: string | null;
  items: ParsedChecklistItem[];
}

/**
 * Parse CSV content into checklist items
 * Expected format: Each line is a checklist item
 * Optional: first column is title, second column is notes
 * If the first line looks like a header (contains "title" or "item"), it's skipped
 */
export function parseCSV(content: string, fileName: string): ParsedChecklist {
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== '');

  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  const items: ParsedChecklistItem[] = [];
  let startIndex = 0;

  // Check if first line is a header - only match header keywords at word boundaries
  const firstLine = lines[0].toLowerCase();
  const headerKeywords = /^(title|item|task|name|description|notes)(,|$)/;
  if (headerKeywords.test(firstLine.trim())) {
    startIndex = 1;
  }

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line - handle quoted values
    const parts = parseCSVLine(line);
    const title = parts[0]?.trim();

    if (title) {
      items.push({
        title,
        notes: parts[1]?.trim() || null,
      });
    }
  }

  if (items.length === 0) {
    throw new Error('No valid checklist items found in CSV');
  }

  // Generate checklist title from filename
  const checklistTitle = fileName
    .replace(/\.csv$/i, '')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: checklistTitle,
    description: `Imported from ${fileName}`,
    items,
  };
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/**
 * Parse Markdown content into checklist items
 * Supports:
 * - Task lists: - [ ] item or - [x] item (checked items are still added)
 * - Unordered lists: - item or * item
 * - Ordered lists: 1. item
 * - Headers become the checklist title (first # header)
 */
export function parseMarkdown(
  content: string,
  fileName: string
): ParsedChecklist {
  const lines = content.split(/\r?\n/);
  const items: ParsedChecklistItem[] = [];
  let checklistTitle: string | null = null;
  let description: string | null = null;
  let currentNotes: string[] = [];

  // Pattern for markdown task list items: - [ ] or - [x]
  const taskListPattern = /^[-*]\s*\[([ xX])\]\s+(.+)$/;
  // Pattern for unordered list items: - or *
  const unorderedListPattern = /^[-*]\s+(.+)$/;
  // Pattern for ordered list items: 1. 2. etc.
  const orderedListPattern = /^\d+\.\s+(.+)$/;
  // Pattern for headers
  const headerPattern = /^#+\s+(.+)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) {
      continue;
    }

    // Check for header - use first header as title
    const headerMatch = trimmedLine.match(headerPattern);
    if (headerMatch) {
      if (!checklistTitle) {
        checklistTitle = headerMatch[1].trim();
      } else if (!description) {
        // Use second header as description
        description = headerMatch[1].trim();
      }
      continue;
    }

    // Check for task list items first (most specific)
    const taskMatch = trimmedLine.match(taskListPattern);
    if (taskMatch) {
      // Save any accumulated notes to previous item
      if (items.length > 0 && currentNotes.length > 0) {
        items[items.length - 1].notes = currentNotes.join('\n');
        currentNotes = [];
      }

      items.push({
        title: taskMatch[2].trim(),
        notes: null,
      });
      continue;
    }

    // Check for unordered list items
    const unorderedMatch = trimmedLine.match(unorderedListPattern);
    if (unorderedMatch) {
      // Save any accumulated notes to previous item
      if (items.length > 0 && currentNotes.length > 0) {
        items[items.length - 1].notes = currentNotes.join('\n');
        currentNotes = [];
      }

      items.push({
        title: unorderedMatch[1].trim(),
        notes: null,
      });
      continue;
    }

    // Check for ordered list items
    const orderedMatch = trimmedLine.match(orderedListPattern);
    if (orderedMatch) {
      // Save any accumulated notes to previous item
      if (items.length > 0 && currentNotes.length > 0) {
        items[items.length - 1].notes = currentNotes.join('\n');
        currentNotes = [];
      }

      items.push({
        title: orderedMatch[1].trim(),
        notes: null,
      });
      continue;
    }

    // If we have items, treat non-list text as notes for the previous item
    if (items.length > 0 && trimmedLine) {
      currentNotes.push(trimmedLine);
    }
  }

  // Assign any remaining notes to the last item
  if (items.length > 0 && currentNotes.length > 0) {
    items[items.length - 1].notes = currentNotes.join('\n');
  }

  if (items.length === 0) {
    throw new Error(
      'No valid checklist items found in Markdown. Use list items (-, *, or 1.) or task lists (- [ ])'
    );
  }

  // Use title from content or generate from filename
  const finalTitle =
    checklistTitle ||
    fileName
      .replace(/\.md$/i, '')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: finalTitle,
    description: description || `Imported from ${fileName}`,
    items,
  };
}

/**
 * Parse file content based on file extension
 */
export function parseFile(
  content: string,
  fileName: string
): ParsedChecklist {
  const extension = fileName.toLowerCase().split('.').pop();

  switch (extension) {
    case 'csv':
      return parseCSV(content, fileName);
    case 'md':
    case 'markdown':
      return parseMarkdown(content, fileName);
    default:
      throw new Error(
        `Unsupported file type: .${extension}. Please use .csv or .md files.`
      );
  }
}
