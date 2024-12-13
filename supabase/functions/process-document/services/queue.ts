export class QueueService {
  private maxRetries: number;
  private baseDelay: number;

  constructor(maxRetries = 3, baseDelay = 1000) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    retryCount = 0
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retryCount >= this.maxRetries) {
        console.error(`Max retries (${this.maxRetries}) reached:`, error);
        throw error;
      }

      const delay = this.calculateBackoff(retryCount);
      console.log(`Retry ${retryCount + 1}/${this.maxRetries} after ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.executeWithRetry(operation, retryCount + 1);
    }
  }

  private calculateBackoff(retryCount: number): number {
    // Exponential backoff with jitter
    const exponential = Math.pow(2, retryCount) * this.baseDelay;
    const jitter = Math.random() * 1000;
    return Math.min(exponential + jitter, 10000); // Max 10 seconds
  }
}