import { NextRequest, NextResponse } from 'next/server';
import {
  createChatSession,
  sendChatMessage,
  extractJsonFromResponse,
  isAIConfigured,
  REGENERATE_SYSTEM_PROMPT,
  IMPROVE_SYSTEM_PROMPT,
  REGENERATE_ACK,
  IMPROVE_ACK,
  generateRegeneratePrompt,
  generateImprovePrompt,
  parseRegeneratedBlock,
  createFallbackBlock,
  type BlockInput,
} from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { action, block, instruction, selectedText } = await request.json();

    if (!isAIConfigured()) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    if (action === 'regenerate') {
      return handleRegenerate(block, instruction);
    } else if (action === 'improve') {
      return handleImprove(selectedText, instruction);
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "regenerate" or "improve"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Handle block regeneration
 */
async function handleRegenerate(
  block: BlockInput | undefined,
  instruction?: string
) {
  if (!block) {
    return NextResponse.json(
      { error: 'Block is required for regeneration' },
      { status: 400 }
    );
  }

  const prompt = generateRegeneratePrompt(block, instruction);
  const chat = createChatSession(REGENERATE_SYSTEM_PROMPT, REGENERATE_ACK);
  const text = await sendChatMessage(chat, prompt);

  // Try to parse JSON response
  const parsed = extractJsonFromResponse<BlockInput>(text);

  const regeneratedBlock = parsed
    ? parseRegeneratedBlock(parsed, block)
    : createFallbackBlock(text, block);

  return NextResponse.json({
    block: regeneratedBlock,
    success: true,
  });
}

/**
 * Handle text improvement
 */
async function handleImprove(
  selectedText: string | undefined,
  instruction: string | undefined
) {
  if (!selectedText || !instruction) {
    return NextResponse.json(
      { error: 'Selected text and instruction are required' },
      { status: 400 }
    );
  }

  const prompt = generateImprovePrompt(selectedText, instruction);
  const chat = createChatSession(IMPROVE_SYSTEM_PROMPT, IMPROVE_ACK);
  const improvedText = await sendChatMessage(chat, prompt);

  return NextResponse.json({
    improvedText: improvedText.trim(),
    success: true,
  });
}
