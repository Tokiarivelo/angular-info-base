import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Gemini AI client - automatically reads GEMINI_API_KEY from env
const ai = new GoogleGenAI({});

// Course context interface
interface CourseContext {
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

// Generate dynamic system prompt based on course context
const generateSystemPrompt = (courseContext: CourseContext): string => {
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
  const exampleIntro = isFrench ? 'Introduction' : 'Introduction';
  const exampleWelcome = isFrench ? 'Bienvenue dans...' : 'Welcome to...';
  const exampleTip = isFrench ? 'Bonne pratique' : 'Best Practice';
  const exampleTipContent = isFrench
    ? 'Pensez toujours à...'
    : 'Always consider...';
  const codeLang = language || 'typescript';

  return `You are an expert technical writer and instructor. Your task is to generate educational chapter content for a learning platform.

Course: ${title}${courseDescription}${langInstruction}

When generating content, follow these guidelines:
1. Structure content with clear sections using rich text blocks
2. Include practical examples with code blocks${languageHint}
3. Add "Pro Tip" sections for best practices and advanced insights
4. Use clear, concise language suitable for developers/learners
5. Include relevant code examples that demonstrate the concepts
6. Tailor the content specifically to the "${title}" course
7. Write all text content in ${contentLangName}

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
    { "type": "richText", "content": "<h2>${exampleIntro}</h2><p>${exampleWelcome}</p>" },
    { "type": "proTip", "title": "${exampleTip}", "content": "<p>${exampleTipContent}</p>" },
    { "type": "code", "title": "${codeLang}", "content": "// Example code" },
    { "type": "separator" }
  ]
}

Generate comprehensive, educational content in ${contentLangName} that helps learners master ${title} effectively.`;
};

export async function POST(request: NextRequest) {
  try {
    const {
      prompt,
      conversationHistory = [],
      courseContext,
    } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Use provided course context or default to a generic one
    const context: CourseContext = courseContext || {
      title: 'Technical Course',
      language: 'typescript',
    };

    const systemPrompt = generateSystemPrompt(context);

    // Generate the AI acknowledgment message based on language
    const isFrench = context.contentLanguage === 'fr';
    const ackMessage = isFrench
      ? `Je comprends. Je vais générer du contenu éducatif en français pour "${context.title}" dans le format JSON spécifié avec les métadonnées du chapitre et les blocs de contenu.`
      : `I understand. I will generate educational content for "${context.title}" in the specified JSON format with chapter metadata and content blocks.`;

    // Build the conversation history for chat
    const history = [
      { role: 'user' as const, parts: [{ text: systemPrompt }] },
      {
        role: 'model' as const,
        parts: [{ text: ackMessage }],
      },
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: msg.content }],
      })),
    ];

    // Create a chat session using gemini-2.5-flash for fast, low-latency responses
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history,
    });

    // Send the message and get response
    const response = await chat.sendMessage({ message: prompt });
    const text = response.text ?? '';

    // Try to parse as JSON if the response contains blocks
    let parsedBlocks = null;
    let chapterTitle = null;
    let chapterDescription = null;
    let imagePrompt = null;

    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonCodeBlock = /```json\s*([\s\S]*?)\s*```/;
      const genericCodeBlock = /```\s*([\s\S]*?)\s*```/;

      let jsonString = text;
      const jsonMatch = text.match(jsonCodeBlock);
      if (jsonMatch && jsonMatch[1]) {
        jsonString = jsonMatch[1];
      } else {
        const genericMatch = text.match(genericCodeBlock);
        if (genericMatch && genericMatch[1]) {
          jsonString = genericMatch[1];
        }
      }

      const parsed = JSON.parse(jsonString.trim());

      // Extract chapter metadata
      chapterTitle = parsed.chapterTitle || null;
      chapterDescription = parsed.chapterDescription || null;
      imagePrompt = parsed.imagePrompt || null;

      // Extract blocks
      parsedBlocks = parsed.blocks || parsed;
    } catch {
      // If JSON parsing fails, return as plain text response
      parsedBlocks = null;
    }

    return NextResponse.json({
      message: text,
      blocks: parsedBlocks,
      chapterTitle,
      chapterDescription,
      imagePrompt,
      success: true,
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: String(error) },
      { status: 500 }
    );
  }
}
