import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db-health';

export async function GET() {
  try {
    const healthCheck = await checkDatabaseHealth(10000); // 10 second timeout

    if (healthCheck.isHealthy) {
      return NextResponse.json(
        {
          status: 'healthy',
          database: {
            connected: true,
            latencyMs: healthCheck.latencyMs,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: 'unhealthy',
          database: {
            connected: false,
            error: healthCheck.error,
            latencyMs: healthCheck.latencyMs,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
