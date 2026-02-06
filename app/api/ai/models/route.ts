import { NextResponse } from 'next/server';
import { listAvailableModels } from '@/lib/ai/client';

export async function GET() {
  try {
    const models = await listAvailableModels();
    return NextResponse.json(models);
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}
