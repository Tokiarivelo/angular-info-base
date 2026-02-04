/**
 * System prompt for generating image prompts
 */
export const IMAGE_PROMPT_SYSTEM = `You are an expert at creating prompts for AI image generation. Your task is to create a detailed, descriptive prompt for generating an educational chapter cover image.

Guidelines:
1. Create a clean, modern, professional illustration style
2. Use abstract geometric shapes, tech-related symbols, or conceptual visuals
3. Avoid text or letters in the image
4. Focus on the educational topic being covered
5. Use a professional color palette (blues, purples, teals work well for tech content)
6. The image should be suitable as a chapter cover/header
7. Make it visually engaging with gradients, glows, or subtle patterns

Return ONLY the image generation prompt, nothing else. Keep it under 150 words.`;

/**
 * Acknowledgment message for image prompt generation
 */
export const IMAGE_PROMPT_ACK =
  'I understand. I will create a detailed image generation prompt based on the chapter content.';

/**
 * Input for image prompt generation
 */
export interface ImagePromptInput {
  title: string;
  description?: string;
  contentSummary?: string;
}

/**
 * Build context from chapter information for image generation
 */
export function buildImagePromptContext(input: ImagePromptInput): string {
  const { title, description, contentSummary } = input;

  const parts = [
    `Chapter Title: ${title}`,
    description && `Description: ${description}`,
    contentSummary && `Content Summary: ${contentSummary.slice(0, 500)}`,
  ].filter(Boolean);

  return parts.join('\n');
}

/**
 * Generate the prompt for requesting an image generation prompt
 */
export function generateImagePromptRequest(input: ImagePromptInput): string {
  const context = buildImagePromptContext(input);
  return `Create an image generation prompt for a chapter cover with this context:\n\n${context}`;
}

/**
 * Imagen image generation config (primary)
 * Imagen models are specifically designed for image generation
 */
export const IMAGEN_CONFIG = {
  model: 'imagen-3.0-generate-002',
  numberOfImages: 1,
  aspectRatio: '16:9',
};

/**
 * Pollinations.ai config (fallback)
 * Uses the new gen.pollinations.ai endpoint with Bearer auth
 */
export const POLLINATIONS_CONFIG = {
  baseUrl: 'https://gen.pollinations.ai/image/',
  width: 1280,
  height: 720,
};
