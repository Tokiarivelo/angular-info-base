import { prisma } from './prisma';

export interface DatabaseHealthCheck {
  isHealthy: boolean;
  latencyMs?: number;
  error?: string;
}

/**
 * Check if the database is reachable and responsive
 * @param timeoutMs - Maximum time to wait for response (default: 5000ms)
 * @returns DatabaseHealthCheck object with health status
 */
export async function checkDatabaseHealth(
  timeoutMs: number = 5000
): Promise<DatabaseHealthCheck> {
  const startTime = Date.now();

  try {
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(
        () => reject(new Error('Database health check timeout')),
        timeoutMs
      );
    });

    // Simple query to check database connectivity
    const queryPromise = prisma.$executeRaw`SELECT 1`;

    // Race between query and timeout
    await Promise.race([queryPromise, timeoutPromise]);

    const latencyMs = Date.now() - startTime;

    return {
      isHealthy: true,
      latencyMs,
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    // Log the full error for debugging
    console.error('Database health check error:', error);

    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
    } else {
      console.error('Non-Error object thrown:', error);
    }

    return {
      isHealthy: false,
      latencyMs,
      error: errorMessage,
    };
  }
}

/**
 * Retry a database operation with exponential backoff
 * @param operation - The async operation to retry
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param initialDelayMs - Initial delay between retries in ms (default: 1000)
 * @returns Result of the operation
 */
export async function retryDatabaseOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s, etc.
      const delayMs = initialDelayMs * Math.pow(2, attempt);
      console.log(
        `Database operation failed (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delayMs}ms...`,
        lastError.message
      );

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}
