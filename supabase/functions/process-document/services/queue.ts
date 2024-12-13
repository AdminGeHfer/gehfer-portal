export class QueueService {
  private queue: Promise<any>[] = [];
  private concurrency: number = 2;
  private running: number = 0;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000;

  async enqueue<T>(task: () => Promise<T>): Promise<T> {
    while (this.running >= this.concurrency) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.running++;

    try {
      return await this.executeWithRetry(task);
    } finally {
      this.running--;
    }
  }

  private async executeWithRetry<T>(
    task: () => Promise<T>, 
    attempt: number = 1
  ): Promise<T> {
    try {
      return await task();
    } catch (error) {
      if (attempt >= this.retryAttempts) {
        throw error;
      }

      const delay = this.retryDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));

      return this.executeWithRetry(task, attempt + 1);
    }
  }
}