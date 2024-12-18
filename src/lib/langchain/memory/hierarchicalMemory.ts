import { BaseMemory, ChatMessageHistory } from "langchain/memory";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Message } from "@/types/ai";

interface HierarchicalMemoryConfig {
  maxTokens?: number;
  compressionThreshold?: number;
  useSemanticCompression?: boolean;
}

export class HierarchicalMemory extends BaseMemory {
  private shortTermMemory: ChatMessageHistory;
  private longTermMemory: ChatMessageHistory;
  private maxTokens: number;
  private compressionThreshold: number;
  private useSemanticCompression: boolean;

  constructor(config?: HierarchicalMemoryConfig) {
    super();
    this.shortTermMemory = new ChatMessageHistory();
    this.longTermMemory = new ChatMessageHistory();
    this.maxTokens = config?.maxTokens || 4000;
    this.compressionThreshold = config?.compressionThreshold || 0.7;
    this.useSemanticCompression = config?.useSemanticCompression || true;
  }

  // Implement required abstract property
  get memoryKeys(): string[] {
    return ["history"];
  }

  async loadMemoryVariables(): Promise<{ history: string }> {
    const shortTermMessages = await this.shortTermMemory.getMessages();
    const longTermMessages = await this.longTermMemory.getMessages();
    
    const relevantLongTerm = this.filterRelevantMemories(longTermMessages);
    const combinedHistory = [...relevantLongTerm, ...shortTermMessages];
    
    return {
      history: this.formatMessages(combinedHistory)
    };
  }

  async saveContext(inputValues: { input: string }, outputValues: { output: string }): Promise<void> {
    const { input } = inputValues;
    const { output } = outputValues;

    await this.shortTermMemory.addMessage(new HumanMessage(input));
    await this.shortTermMemory.addMessage(new AIMessage(output));

    await this.compressMemoryIfNeeded();
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
    return messages;
  }

  private async moveToLongTermMemory(messages: any[]): Promise<void> {
    for (const message of messages) {
      await this.longTermMemory.addMessage(message);
    }
  }

  private async clearShortTermMemory(): Promise<void> {
    this.shortTermMemory = new ChatMessageHistory();
  }

  private filterRelevantMemories(messages: any[]): any[] {
    return messages;
  }

  private formatMessages(messages: any[]): string {
    return messages
      .map(m => `${m._getType()}: ${m.content}`)
      .join('\n');
  }
}