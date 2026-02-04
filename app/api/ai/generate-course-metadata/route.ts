import { NextRequest, NextResponse } from 'next/server';
import {
  createChatSession,
  sendChatMessage,
  isAIConfigured,
  extractJsonFromResponse,
  createErrorResponse,
} from '@/lib/ai';
import {
  COURSE_GENERATION_SYSTEM_PROMPT,
  GeneratedCourseMetadata,
} from '@/lib/ai/prompts/course';

import { extractTextFromBuffer } from '@/lib/fileParser';

// ... imports

export async function POST(request: NextRequest) {
  try {
    let topic = '';
    let model = undefined;
    let fileContent = '';

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      topic = (formData.get('topic') as string) || '';
      model = (formData.get('model') as string) || undefined;
      const file = formData.get('file') as File | null;

      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const mimeType = file.type || 'text/plain';
        fileContent = await extractTextFromBuffer(buffer, mimeType);
      }
    } else {
      const body = await request.json();
      topic = body.topic;
      model = body.model;
    }

    if (!topic && !fileContent) {
      return NextResponse.json(
        createErrorResponse('Topic or file is required', 400),
        {
          status: 400,
        }
      );
    }

    if (!(await isAIConfigured())) {
      return NextResponse.json(
        createErrorResponse('AI is not configured', 500),
        { status: 500 }
      );
    }

    const chat = await createChatSession(
      COURSE_GENERATION_SYSTEM_PROMPT,
      'Understood. I will generate a course structure in JSON format.',
      [],
      model
    );

    const userPrompt = fileContent
      ? `Generate a course structure based on the following document content. Extract the main topics and structure a comprehensive course around it.
      
      Document Content:
      """
      ${fileContent.slice(0, 30000)}
      """
      
      Preferred Title/Topic: ${topic || 'Infer from content'}`
      : `Generate a course structure for the topic: "${topic}".`;

    const responseText = await sendChatMessage(chat, userPrompt);

    const metadata =
      extractJsonFromResponse<GeneratedCourseMetadata>(responseText);

    if (!metadata) {
      return NextResponse.json(
        createErrorResponse('Failed to parse AI response', 500),
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: metadata,
    });
  } catch (error) {
    console.error('Course generation error:', error);
    return NextResponse.json(
      createErrorResponse(
        'Failed to generate course metadata',
        500,
        String(error)
      ),
      { status: 500 }
    );
  }
}
