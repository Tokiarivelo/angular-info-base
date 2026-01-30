// Course context interface
export interface CourseContext {
  title: string;
  description?: string;
  language?: string; // Programming language if applicable
  contentLanguage?: 'en' | 'fr'; // Language for generated content
}

// Language display names for prompts
const languageNames: Record<string, string> = {
  en: 'English',
  fr: 'French (Français)',
};

/**
 * HTML styling guidelines for CKEditor compatibility - User-friendly version
 */
const HTML_STYLING_GUIDE = `
## HTML Formatting Guidelines (VERY IMPORTANT):

Generate clean, readable HTML content that uses these CKEditor-compatible elements:

### Text Styling:
- Use <strong> for important terms and key concepts
- Use <em> for emphasis and technical terms

### Structure:
- Use <h2> for main section headings
- Use <h3> for subsection headings
- Use <h4> for minor headings
- Use <p> for paragraphs with proper spacing
- Use <blockquote> for important quotes or definitions

### Lists (VERY IMPORTANT - use proper HTML):
- Use <ul> and <li> for unordered/bullet lists
- Use <ol> and <li> for numbered/ordered lists
- ALWAYS wrap list items in <li> tags
- NEVER use plain text with dashes or asterisks for lists

### Examples of good formatting:
<h2>Getting Started</h2>
<p>Let's explore the <strong>key concepts</strong> of this topic:</p>
<ul>
  <li><strong>First concept</strong> - explanation here</li>
  <li><strong>Second concept</strong> - explanation here</li>
  <li><strong>Third concept</strong> - explanation here</li>
</ul>
<p>Here are the <em>important benefits</em>:</p>
<ol>
  <li>Improved performance</li>
  <li>Better maintainability</li>
  <li>Enhanced scalability</li>
</ol>
<blockquote>💡 Remember: Always follow best practices for optimal results.</blockquote>

Make the content well-structured, use varied formatting, and organize information clearly!
`;

/**
 * Generate dynamic system prompt based on course context
 */
export function generateChapterSystemPrompt(
  courseContext: CourseContext
): string {
  const {
    title,
    description,
    language,
    contentLanguage = 'en',
  } = courseContext;

  const languageHint = language ? ` (use ${language})` : '';
  const courseDescription = description
    ? `\n\nCourse Description: ${description}`
    : '';

  const contentLangName = languageNames[contentLanguage] || 'English';
  const isFrench = contentLanguage === 'fr';

  const langInstruction = isFrench
    ? '\n\nIMPORTANT: Generate ALL content in French (Français). This includes the chapter title, description, all text content within blocks, and pro tips. Code comments can remain in English if appropriate, but explanatory text must be in French.'
    : '\n\nGenerate all content in English.';

  // Generate example content based on language
  const exampleTitle = isFrench
    ? `Introduction à ${title}`
    : `Introduction to ${title}`;
  const exampleDesc = isFrench
    ? `Apprenez les fondamentaux de ${title} et comprenez son importance.`
    : `Learn the fundamentals of ${title} and understand why it is important.`;
  const codeLang = language || 'typescript';

  const introWord = isFrench ? 'Introduction' : 'Introduction';
  const welcomeText = isFrench
    ? `Bienvenue dans ce chapitre sur <strong>${title}</strong>. Nous allons explorer les <em>concepts clés</em> ensemble.`
    : `Welcome to this chapter on <strong>${title}</strong>. We will explore the <em>key concepts</em> together.`;

  const tipTitle = isFrench ? 'Bonne Pratique' : 'Best Practice';
  const tipContent = isFrench
    ? `<p>Voici les <strong>points essentiels</strong> à retenir:</p><ul><li>Premier point important</li><li>Deuxième point important</li></ul>`
    : `<p>Here are the <strong>essential points</strong> to remember:</p><ul><li>First important point</li><li>Second important point</li></ul>`;

  return `You are an expert technical writer and instructor. Your task is to generate educational chapter content for a learning platform.

Course: ${title}${courseDescription}${langInstruction}
${HTML_STYLING_GUIDE}

When generating content, follow these guidelines:
1. Structure content with clear sections using rich text blocks with proper HTML formatting
2. Include practical examples with code blocks${languageHint}
3. Add "Pro Tip" sections for best practices and advanced insights
4. Use clear, concise language suitable for developers/learners
5. Include relevant code examples that demonstrate the concepts
6. Tailor the content specifically to the "${title}" course
7. Write all text content in ${contentLangName}
8. Use proper HTML formatting - headings, lists, bold, italic, blockquotes
9. Make content well-structured and easy to read

Output your response in JSON format with chapter metadata AND content blocks:
- chapterTitle: A concise, descriptive title for this chapter in ${contentLangName}
- chapterDescription: A 1-2 sentence description in ${contentLangName} of what learners will learn
- imagePrompt: A descriptive prompt for generating an educational illustration/image for this chapter (always in English for the image generator)
- blocks: Array of content blocks with text in ${contentLangName}

Each block should have:
- type: "richText" | "proTip" | "code" | "separator"
- content: The HTML content (for richText and proTip) or code string (for code)
- title: Optional title for proTip blocks or language for code blocks

Example format:
{
  "chapterTitle": "${exampleTitle}",
  "chapterDescription": "${exampleDesc}",
  "imagePrompt": "A clean, modern illustration showing ${title.toLowerCase()} concepts with abstract geometric shapes and code symbols, professional tech style, blue and purple gradient background",
  "blocks": [
    { "type": "richText", "content": "<h2>${introWord}</h2><p>${welcomeText}</p>" },
    { "type": "proTip", "title": "${tipTitle}", "content": "${tipContent}" },
    { "type": "code", "title": "${codeLang}", "content": "// Example code\\nconst example = 'Hello World';" },
    { "type": "separator" }
  ]
}

Generate comprehensive, educational content in ${contentLangName} that helps learners master ${title} effectively. 
REMEMBER: Use proper HTML lists (<ul>, <ol>, <li>), headings, and formatting!`;
}

/**
 * Generate acknowledgment message based on language
 */
export function generateChapterAckMessage(context: CourseContext): string {
  const isFrench = context.contentLanguage === 'fr';
  return isFrench
    ? `Je comprends. Je vais générer du contenu éducatif bien formaté en français pour "${context.title}" avec des listes HTML, des titres et une mise en forme professionnelle.`
    : `I understand. I will generate well-formatted educational content for "${context.title}" with proper HTML lists, headings, and professional formatting.`;
}

/**
 * Default course context when none is provided
 */
export function getDefaultCourseContext(): CourseContext {
  return {
    title: 'Technical Course',
    language: 'typescript',
    contentLanguage: 'en',
  };
}

/**
 * Parse the AI response for chapter generation
 */
export interface ChapterGenerationResult {
  chapterTitle: string | null;
  chapterDescription: string | null;
  imagePrompt: string | null;
  blocks: any[] | null;
}

export function parseChapterGenerationResponse(
  parsed: any
): ChapterGenerationResult {
  return {
    chapterTitle: parsed.chapterTitle || null,
    chapterDescription: parsed.chapterDescription || null,
    imagePrompt: parsed.imagePrompt || null,
    blocks: parsed.blocks || parsed,
  };
}
