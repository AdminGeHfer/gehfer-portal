import { CONFIG } from "../config.ts";

export class QueueService {
  private queue: any[] = [];
  private processing = false;

  constructor(private batchSize = CONFIG.BATCH_SIZE) {}

  async add(item: any): Promise<void> {
    this.queue.push(item);
    if (!this.processing) {
      await this.process();
    }
  }

  private async process(): Promise<void> {
    this.processing = true;
    
    try {
      while (this.queue.length > 0) {
        const batch = this.queue.splice(0, this.batchSize);
        await Promise.all(batch.map(item => this.executeWithRetry(item)));
        
        if (this.queue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, CONFIG.INTER_CHUNK_DELAY));
        }
      }
    } catch (error) {
      console.error('Error processing queue:', error);
      throw error;
    } finally {
      this.processing = false;
    }
  }

  async executeWithRetry(item: any): Promise<void> {
    try {
      const { operation, onSuccess, onError } = item;
      const result = await operation();
      if (onSuccess) await onSuccess(result);
    } catch (error) {
      console.error('Error executing queue item:', error);
      if (item.onError) await item.onError(error);
      throw error;
    }
  }
}