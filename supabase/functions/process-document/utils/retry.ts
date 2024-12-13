import { CONFIG } from '../config.ts';

export async function withRetry<T>(
  operation: () => Promise<T>,
  retryCount = 0
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retryCount >= CONFIG.MAX_RETRIES) {
      throw error;
    }

    const delay = Math.min(
      CONFIG.INITIAL_RETRY_DELAY * Math.pow(2, retryCount),
      CONFIG.MAX_RETRY_DELAY
    );

    console.log(`Retry ${retryCount + 1}/${CONFIG.MAX_RETRIES} after ${delay}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));

    return withRetry(operation, retryCount + 1);
  }
}