import { EditorBlock } from '../ChapterRichContentEditor/ChapterRichContentEditor.types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  blocks?: EditorBlock[];
  chapterTitle?: string;
  chapterDescription?: string;
  imagePrompt?: string;
  timestamp: Date;
  isLoading?: boolean;
}

// Course context for dynamic content generation
export interface CourseContext {
  courseId?: string;
  title: string;
  description?: string;
  language?: string; // Programming language if applicable
  contentLanguage?: 'en' | 'fr'; // Language for generated content
}

// Generated chapter data from AI
export interface GeneratedChapterData {
  title?: string;
  description?: string;
  imageUrl?: string;
  blocks: EditorBlock[];
}

export interface AIChapterChatProps {
  onApplyBlocks: (blocks: EditorBlock[]) => void;
  onApplyChapter?: (data: GeneratedChapterData) => void;
  onClose: () => void;
  courseContext?: CourseContext;
}

export interface GenerateContentResponse {
  message: string;
  blocks: EditorBlock[] | null;
  chapterTitle?: string;
  chapterDescription?: string;
  imagePrompt?: string;
  success: boolean;
  error?: string;
}

// Prompt suggestion interface
export interface PromptSuggestion {
  label: string;
  prompt: string;
}

// Generate dynamic prompt suggestions based on course context
export const getPromptSuggestions = (
  courseContext?: CourseContext
): PromptSuggestion[] => {
  const courseName = courseContext?.title || 'the topic';
  const language = courseContext?.language || 'code';

  // Default suggestions when no specific course context
  if (!courseContext?.title) {
    return [
      {
        label: 'Introduction',
        prompt: `Generate an introduction chapter that explains the fundamentals and key concepts.`,
      },
      {
        label: 'Getting Started',
        prompt: `Create a chapter about setting up the development environment and getting started.`,
      },
      {
        label: 'Core Concepts',
        prompt: `Generate a chapter covering the core concepts and fundamental principles.`,
      },
      {
        label: 'Best Practices',
        prompt: `Create a chapter about best practices and common patterns.`,
      },
      {
        label: 'Examples',
        prompt: `Generate a chapter with practical examples and hands-on exercises.`,
      },
    ];
  }

  // Dynamic suggestions based on course context
  return [
    {
      label: 'Introduction',
      prompt: `Generate an introduction chapter for ${courseName}, explaining what it is, why it's important, and what learners will achieve.`,
    },
    {
      label: 'Getting Started',
      prompt: `Create a chapter about setting up the development environment for ${courseName} and creating the first ${language} project.`,
    },
    {
      label: 'Core Concepts',
      prompt: `Generate a chapter covering the core concepts and fundamental principles of ${courseName}.`,
    },
    {
      label: 'Best Practices',
      prompt: `Create a chapter about ${courseName} best practices, common patterns, and tips for writing clean ${language}.`,
    },
    {
      label: 'Advanced Topics',
      prompt: `Generate a chapter about advanced ${courseName} topics and techniques for experienced developers.`,
    },
    {
      label: 'Real-World Examples',
      prompt: `Create a chapter with practical ${courseName} examples and real-world use cases.`,
    },
  ];
};

// Legacy: Keep static suggestions for backward compatibility
export const PROMPT_SUGGESTIONS = getPromptSuggestions();
