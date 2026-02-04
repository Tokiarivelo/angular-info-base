import { NextRequest, NextResponse } from 'next/server';
import {
  getAIClient,
  createChatSession,
  sendChatMessage,
  isAIConfigured,
  IMAGE_PROMPT_SYSTEM,
  IMAGE_PROMPT_ACK,
  IMAGEN_CONFIG,
  POLLINATIONS_CONFIG,
  generateImagePromptRequest,
  type ImagePromptInput,
} from '@/lib/ai';
import { v2 as cloudinary } from 'cloudinary';
import { getSetting } from '@/lib/settings';

// Helper to configure Cloudinary
async function configureCloudinary() {
  const cloud_name = await getSetting('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
  const api_key = await getSetting('CLOUDINARY_API_KEY');
  const api_secret = await getSetting('CLOUDINARY_API_SECRET');

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error('Cloudinary not configured');
  }

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });
}

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      contentSummary,
      generateImage = false,
    } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Chapter title is required' },
        { status: 400 }
      );
    }

    if (!(await isAIConfigured())) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Build input for image prompt generation
    const input: ImagePromptInput = {
      title,
      description,
      contentSummary,
    };

    // Generate the prompt for image generation
    const promptRequest = generateImagePromptRequest(input);

    // Generate the image prompt using AI
    const chat = await createChatSession(IMAGE_PROMPT_SYSTEM, IMAGE_PROMPT_ACK);
    const imagePrompt = await sendChatMessage(chat, promptRequest);
    const cleanedPrompt = imagePrompt.trim();

    // If generateImage is true, generate the actual image
    if (generateImage) {
      await configureCloudinary();

      // Try Imagen first, fallback to Pollinations
      const imagenResult = await handleImagenImageGeneration(cleanedPrompt);
      if (imagenResult.success) {
        return NextResponse.json(imagenResult);
      }

      console.log(
        'Imagen image generation failed, falling back to Pollinations...',
        imagenResult.error
      );
      return handlePollinationsImageGeneration(
        cleanedPrompt,
        imagenResult.error
      );
    }

    // Just return the prompt without generating image
    return NextResponse.json({
      imagePrompt: cleanedPrompt,
      success: true,
    });
  } catch (error) {
    console.error('Image prompt generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image prompt', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Try to generate image using Google Imagen model
 */
async function handleImagenImageGeneration(imagePrompt: string): Promise<{
  success: boolean;
  imagePrompt: string;
  imageUrl?: string;
  publicId?: string;
  error?: string;
}> {
  try {
    const ai = await getAIClient();

    // Use Imagen model for image generation
    // @ts-ignore - generateImages may not be in types yet
    const response = await ai.models.generateImages({
      model: IMAGEN_CONFIG.model,
      prompt: `${imagePrompt}. Create a clean, professional illustration suitable for a chapter cover.`,
      config: {
        numberOfImages: IMAGEN_CONFIG.numberOfImages,
        aspectRatio: IMAGEN_CONFIG.aspectRatio,
      },
    });

    // Extract image from response
    if (response.generatedImages && response.generatedImages.length > 0) {
      const generatedImage = response.generatedImages[0];

      if (generatedImage.image?.imageBytes) {
        const base64Image = generatedImage.image.imageBytes;
        const mimeType = 'image/png';
        const dataURI = `data:${mimeType};base64,${base64Image}`;

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: 'chapter-covers',
          resource_type: 'image',
        });

        return {
          success: true,
          imagePrompt,
          imageUrl: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
        };
      }
    }

    return {
      success: false,
      imagePrompt,
      error: 'No image in Imagen response',
    };
  } catch (error) {
    console.error('Imagen image generation error:', error);
    return {
      success: false,
      imagePrompt,
      error: String(error),
    };
  }
}

/**
 * Helper function to wait for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fallback: Generate image using Pollinations.ai with retry logic
 * Uses the new gen.pollinations.ai endpoint with Bearer auth
 */
async function handlePollinationsImageGeneration(
  imagePrompt: string,
  imagenError?: string
) {
  const { baseUrl, width, height } = POLLINATIONS_CONFIG;
  const apiKey = await getSetting('POLLINATIONS_API_KEY');

  // Simplify and truncate prompt to reduce server load and avoid URI issues
  // Keep only the essential part of the prompt (first 300 chars) for reliability
  const simplifiedPrompt = imagePrompt
    .replace(/[^\w\s,.-]/g, '') // Remove special characters
    .slice(0, 300)
    .trim();

  // Build Pollinations.ai URL with the new format
  // Format: https://gen.pollinations.ai/image/{prompt}?width=X&height=Y
  const encodedPrompt = encodeURIComponent(simplifiedPrompt);
  const imageUrl = `${baseUrl}${encodedPrompt}?width=${width}&height=${height}&nologo=true`;

  // Prepare headers with Bearer auth if API key is available
  const headers: HeadersInit = {};
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const maxRetries = 3;
  let lastError: string = '';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Pollinations attempt ${attempt}/${maxRetries}...`);
      console.log(`URL: ${imageUrl.slice(0, 100)}...`);

      // Fetch the image from Pollinations with Bearer auth
      const response = await fetch(imageUrl, { headers });

      if (response.ok) {
        // Get the image as a buffer
        const imageBuffer = await response.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        const mimeType = response.headers.get('content-type') || 'image/png';
        const dataURI = `data:${mimeType};base64,${base64Image}`;

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: 'chapter-covers',
          resource_type: 'image',
        });

        return NextResponse.json({
          imagePrompt,
          imageUrl: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
          success: true,
          source: 'pollinations',
        });
      }

      // Log the error and prepare for retry
      lastError = `${response.status} ${response.statusText}`;
      console.warn(
        `Pollinations attempt ${attempt} failed with status ${response.status}`
      );

      // If it's a 502/503/504, retry after a delay
      if ([502, 503, 504].includes(response.status) && attempt < maxRetries) {
        const delayMs = attempt * 2000; // 2s, 4s backoff
        console.log(`Retrying in ${delayMs}ms...`);
        await sleep(delayMs);
        continue;
      }

      // For other errors or final retry, break out
      break;
    } catch (fetchError) {
      lastError = String(fetchError);
      console.error(`Pollinations attempt ${attempt} error:`, fetchError);

      if (attempt < maxRetries) {
        const delayMs = attempt * 2000;
        console.log(`Retrying in ${delayMs}ms...`);
        await sleep(delayMs);
        continue;
      }
    }
  }

  // All retries exhausted
  console.error('Pollinations image generation failed after all retries');
  return NextResponse.json({
    imagePrompt,
    imageUrl: null,
    error: `Pollinations API error after ${maxRetries} attempts: ${lastError}`,
    imagenError: imagenError ? `Imagen also failed: ${imagenError}` : undefined,
    success: false,
  });
}
