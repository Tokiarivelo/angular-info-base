import { NextResponse } from 'next/server';
import { listAvailableModels, createErrorResponse } from '@/lib/ai';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const models = await listAvailableModels();
    return NextResponse.json({ success: true, models });
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to fetch models', 500, String(error)),
      { status: 500 }
    );
  }
}
