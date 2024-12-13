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

  private async executeWithRetry(item: any, retryCount = 0): Promise<void> {
    try {
      const { operation } = item;
      await operation();
    } catch (error) {
      console.error(`Error executing operation (attempt ${retryCount + 1}/${CONFIG.MAX_RETRIES}):`, error);
      
      if (retryCount >= CONFIG.MAX_RETRIES - 1) {
        if (item.onError) await item.onError(error);
        throw error;
      }

      const delay = Math.min(
        CONFIG.INITIAL_RETRY_DELAY * Math.pow(2, retryCount),
        CONFIG.MAX_RETRY_DELAY
      );

      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return this.executeWithRetry(item, retryCount + 1);
    }
  }
}