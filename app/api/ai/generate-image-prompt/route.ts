import { NextRequest, NextResponse } from 'next/server';
import {
  getAIClient,
  createChatSession,
  sendChatMessage,
  isAIConfigured,
  IMAGE_PROMPT_SYSTEM,
  IMAGE_PROMPT_ACK,
  GEMINI_IMAGE_CONFIG,
  POLLINATIONS_CONFIG,
  generateImagePromptRequest,
  type ImagePromptInput,
} from '@/lib/ai';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    if (!isAIConfigured()) {
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
    const chat = createChatSession(IMAGE_PROMPT_SYSTEM, IMAGE_PROMPT_ACK);
    const imagePrompt = await sendChatMessage(chat, promptRequest);
    const cleanedPrompt = imagePrompt.trim();

    // If generateImage is true, generate the actual image
    if (generateImage) {
      // Try Gemini first, fallback to Pollinations
      const geminiResult = await handleGeminiImageGeneration(cleanedPrompt);
      if (geminiResult.success) {
        return NextResponse.json(geminiResult);
      }

      console.log(
        'Gemini image generation failed, falling back to Pollinations...'
      );
      return handlePollinationsImageGeneration(cleanedPrompt);
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
 * Try to generate image using Gemini 2.0 Flash Preview Image Generation
 */
async function handleGeminiImageGeneration(imagePrompt: string): Promise<{
  success: boolean;
  imagePrompt: string;
  imageUrl?: string;
  publicId?: string;
  error?: string;
}> {
  try {
    const ai = getAIClient();

    // Use Gemini 2.0 Flash Preview Image Generation
    const response = await ai.models.generateContent({
      model: GEMINI_IMAGE_CONFIG.model,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Generate an image: ${imagePrompt}. Create a clean, professional illustration suitable for a chapter cover.`,
            },
          ],
        },
      ],
      config: {
        responseModalities: [...GEMINI_IMAGE_CONFIG.responseModalities],
      },
    });

    // Extract image from response
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content?.parts || [];

      for (const part of parts) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          const base64Image = part.inlineData.data;
          const mimeType = part.inlineData.mimeType;
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
    }

    return {
      success: false,
      imagePrompt,
      error: 'No image in Gemini response',
    };
  } catch (error) {
    console.error('Gemini image generation error:', error);
    return {
      success: false,
      imagePrompt,
      error: String(error),
    };
  }
}

/**
 * Fallback: Generate image using Pollinations.ai
 */
async function handlePollinationsImageGeneration(imagePrompt: string) {
  try {
    const { baseUrl, width, height, nologo } = POLLINATIONS_CONFIG;
    const apiKey = process.env.POLLINATIONS_API_KEY;

    // Build Pollinations.ai URL
    const encodedPrompt = encodeURIComponent(imagePrompt);
    let imageUrl = `${baseUrl}${encodedPrompt}?width=${width}&height=${height}`;
    if (nologo) imageUrl += '&nologo=true';
    if (apiKey) imageUrl += `&token=${apiKey}`;

    // Fetch the image from Pollinations
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.status}`);
    }

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
  } catch (imageError) {
    console.error('Pollinations image generation error:', imageError);
    return NextResponse.json({
      imagePrompt,
      imageUrl: null,
      error: 'Image generation failed: ' + String(imageError),
      success: false,
    });
  }
}
