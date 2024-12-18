import { BaseMemory, ChatMessageHistory } from "langchain/memory";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { Message } from "@/types/ai";

interface HierarchicalMemoryConfig {
  maxTokens?: number;
  compressionThreshold?: number;
  useSemanticCompression?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export class HierarchicalMemory extends BaseMemory {
  private shortTermMemory: ChatMessageHistory;
  private longTermMemory: ChatMessageHistory;
  private maxTokens: number;
  private compressionThreshold: number;
  private useSemanticCompression: boolean;
  private maxRetries: number;
  private retryDelay: number;

  constructor(config?: HierarchicalMemoryConfig) {
    super();
    this.shortTermMemory = new ChatMessageHistory();
    this.longTermMemory = new ChatMessageHistory();
    this.maxTokens = config?.maxTokens || 4000;
    this.compressionThreshold = config?.compressionThreshold || 0.7;
    this.useSemanticCompression = config?.useSemanticCompression || true;
    this.maxRetries = config?.maxRetries || 3;
    this.retryDelay = config?.retryDelay || 1000;
  }

  get memoryKeys(): string[] {
    return ["chat_history"];
  }

  async loadMemoryVariables(): Promise<{ chat_history: string }> {
    try {
      const shortTermMessages = await this.shortTermMemory.getMessages();
      const longTermMessages = await this.longTermMemory.getMessages();
      
      const relevantLongTerm = await this.filterRelevantMemories(longTermMessages);
      const combinedHistory = [...relevantLongTerm, ...shortTermMessages];
      
      return {
        chat_history: this.formatMessages(combinedHistory)
      };
    } catch (error) {
      console.error('Error loading memory variables:', error);
      return { chat_history: '' };
    }
  }

  async saveContext(inputValues: { input: string }, outputValues: { output: string }): Promise<void> {
    try {
      const { input } = inputValues;
      const { output } = outputValues;

      await this.withRetry(async () => {
        await this.shortTermMemory.addMessage(new HumanMessage(input));
        await this.shortTermMemory.addMessage(new AIMessage(output));
      });

      await this.compressMemoryIfNeeded();
    } catch (error) {
      console.error('Error saving context:', error);
    }
  }

  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        if (attempt < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        }
      }
    }
    throw lastError!;
  }

  private async compressMemoryIfNeeded(): Promise<void> {
    const messages = await this.shortTermMemory.getMessages();
    if (this.shouldCompress(messages)) {
      const compressed = await this.compressMessages(messages);
      await this.moveToLongTermMemory(compressed);
      await this.clearShortTermMemory();
    }
  }

  private shouldCompress(messages: any[]): boolean {
    return messages.length > 10;
  }

  private async compressMessages(messages: any[]): Promise<any[]> {
    if (!this.useSemanticCompression) {
      return messages;
    }

    // Implement semantic compression
    return messages.reduce((compressed: any[], message: any) => {
      if (compressed.length === 0) {
        return [message];
      }

      const lastMessage = compressed[compressed.length - 1];
      const similarity = this.calculateSimilarity(lastMessage.content, message.content);

      if (similarity > this.compressionThreshold) {
        lastMessage.content += ' ' + message.content;
        return compressed;
      }

      return [...compressed, message];
    }, []);
  }

  private calculateSimilarity(text1: string, text2: string): number {
    // Basic similarity calculation
    const words1 = new Set(text1.toLowerCase().split(' '));
    const words2 = new Set(text2.toLowerCase().split(' '));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  }

  private async moveToLongTermMemory(messages: any[]): Promise<void> {
    for (const message of messages) {
      await this.longTermMemory.addMessage(message);
    }
  }

  private async clearShortTermMemory(): Promise<void> {
    this.shortTermMemory = new ChatMessageHistory();
  }

  private async filterRelevantMemories(messages: any[]): Promise<any[]> {
    // Implement relevance filtering
    return messages;
  }

  private formatMessages(messages: any[]): string {
    return messages
      .map(m => `${m._getType()}: ${m.content}`)
      .join('\n');
  }
}