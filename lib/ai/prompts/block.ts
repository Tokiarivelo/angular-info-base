/**
 * HTML styling guidelines for CKEditor compatibility - User-friendly version
 */
const HTML_STYLING_GUIDE = `
## HTML Formatting (IMPORTANT):

Use clean, readable HTML formatting compatible with CKEditor:

### Text Styling:
- <strong> for important terms and key concepts
- <em> for emphasis and technical terms

### Structure:
- <h2>, <h3>, <h4> for headings
- <p> for paragraphs
- <blockquote> for quotes or important notes

### Lists (CRITICAL):
- <ul> + <li> for bullet lists (NOT dashes or asterisks)
- <ol> + <li> for numbered lists

Example:
<h3>Key Points</h3>
<ul>
  <li><strong>First</strong> - explanation here</li>
  <li><strong>Second</strong> - explanation here</li>
</ul>
<p>This is a <em>simple example</em> with <strong>clean formatting</strong>.</p>
`;

/**
 * System prompt for block regeneration
 */
export const REGENERATE_SYSTEM_PROMPT = `You are an expert technical writer and instructor. Your task is to regenerate or improve a specific content block for a learning platform.
${HTML_STYLING_GUIDE}

When regenerating content, follow these guidelines:
1. Maintain the same block type format
2. Keep the content educational and relevant
3. Use clear, concise language suitable for developers
4. For code blocks, ensure the code is correct and follows best practices
5. For pro tips, make them actionable and insightful
6. Use proper HTML formatting - headings, lists, bold, italic
7. ALWAYS use proper HTML <ul>/<ol> and <li> for lists, never plain text dashes

The block types are:
- richText: HTML content with paragraphs, headings, lists, bold, italic
- proTip: A tip/advice block with a title and HTML content
- code: Code snippet with a language identifier
- separator: Just a horizontal divider (no content)

Output your response in JSON format:
{
  "type": "richText|proTip|code|separator",
  "content": "The regenerated HTML content (with proper formatting and lists)",
  "title": "Title for proTip or language for code blocks (optional)"
}`;

/**
 * System prompt for improving selected text
 */
export const IMPROVE_SYSTEM_PROMPT = `You are an expert technical writer and instructor. Your task is to improve or modify selected text based on user instructions.
${HTML_STYLING_GUIDE}

When improving content:
1. Follow the user's specific instructions for modification
2. Keep the content educational and relevant
3. Maintain similar length unless asked to expand/shorten
4. Use proper HTML formatting (lists, bold, italic where appropriate)
5. If the text contains lists, use proper <ul>/<ol> and <li> tags
6. Make improvements while keeping the original intent

Return ONLY the improved text/HTML, nothing else.`;

/**
 * Acknowledgment message for regeneration
 */
export const REGENERATE_ACK =
  'I understand. I will regenerate content blocks with proper HTML formatting including lists, headings, and styling.';

/**
 * Acknowledgment message for improvement
 */
export const IMPROVE_ACK =
  'I understand. I will improve the selected text with proper HTML formatting based on your instructions.';

/**
 * Block interface for AI operations
 */
export interface BlockInput {
  type: string;
  content: string;
  title?: string;
}

/**
 * Generate prompt for block regeneration
 */
export function generateRegeneratePrompt(
  block: BlockInput,
  instruction?: string
): string {
  const formattingReminder =
    '\n\nREMEMBER: Use proper HTML formatting - <ul>/<ol> for lists, <strong> for bold, <em> for emphasis, and proper headings.';

  if (instruction) {
    return `Regenerate this ${block.type} block with the following instruction: "${instruction}"\n\nCurrent content:\n${block.content}${formattingReminder}`;
  }

  return `Regenerate and improve this ${block.type} block. Make it more engaging and informative while maintaining the same topic:\n\nCurrent content:\n${block.content}${block.title ? `\nTitle: ${block.title}` : ''}${formattingReminder}`;
}

/**
 * Generate prompt for text improvement
 */
export function generateImprovePrompt(
  selectedText: string,
  instruction: string
): string {
  return `${instruction}\n\nText to improve:\n${selectedText}\n\nIf the improved text contains lists, use proper HTML <ul> or <ol> with <li> tags. Use <strong> for important terms.`;
}

/**
 * Parse regenerated block from AI response
 */
export function parseRegeneratedBlock(
  parsed: any,
  originalBlock: BlockInput
): BlockInput {
  return {
    type: parsed.type || originalBlock.type,
    content: parsed.content || '',
    title: parsed.title || originalBlock.title,
  };
}

/**
 * Create fallback block when JSON parsing fails
 */
export function createFallbackBlock(
  text: string,
  originalBlock: BlockInput
): BlockInput {
  return {
    type: originalBlock.type,
    content: text,
    title: originalBlock.title,
  };
}
