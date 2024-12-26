import { BaseMemory } from "langchain/memory";
import { Message } from "@/types/ai";
import { supabase } from "@/integrations/supabase/client";

interface MemoryLevel {
  content: string;
  importance: number;
  timestamp: number;
}

export class HierarchicalMemory extends BaseMemory {
  private shortTermMemory: Message[] = [];
  private longTermMemory: MemoryLevel[] = [];
  private readonly maxShortTermSize: number;
  private readonly compressionThreshold: number;
  private conversationId: string;

  constructor(conversationId: string, maxShortTermSize = 10, compressionThreshold = 0.7) {
    super();
    this.maxShortTermSize = maxShortTermSize;
    this.compressionThreshold = compressionThreshold;
    this.conversationId = conversationId;
  }

  // Implement required BaseMemory methods
  get memoryKeys() {
    return ["chat_history"];
  }

  async loadMemoryVariables(_: object) {
    return {
      chat_history: this.shortTermMemory,
    };
  }

  async saveContext(inputValues: object, outputValues: object) {
    const input = (inputValues as any).input;
    const output = (outputValues as any).output;
    
    if (input) {
      await this.addMemory({
        id: crypto.randomUUID(),
        conversation_id: this.conversationId,
        role: 'user',
        content: input,
        created_at: new Date().toISOString()
      });
    }
    
    if (output) {
      await this.addMemory({
        id: crypto.randomUUID(),
        conversation_id: this.conversationId,
        role: 'assistant',
        content: output,
        created_at: new Date().toISOString()
      });
    }
  }

  async getRelevantHistory(query: string): Promise<Message[]> {
    console.log('Getting relevant history for query:', query);
    
    const relevantMemories = [...this.shortTermMemory];
    
    try {
      const { data: longTermData, error } = await supabase
        .from('ai_memory_buffers')
        .select('*')
        .eq('conversation_id', this.conversationId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (longTermData) {
        const longTermMessages = longTermData.map(item => ({
          id: crypto.randomUUID(),
          conversation_id: this.conversationId,
          role: 'assistant' as const,
          content: item.content,
          created_at: item.created_at
        }));
        
        relevantMemories.push(...longTermMessages);
      }

      return this.filterAndRankMemories(relevantMemories, query);
    } catch (error) {
      console.error('Error retrieving memory:', error);
      return this.shortTermMemory;
    }
  }

  private filterAndRankMemories(memories: Message[], query: string): Message[] {
    return memories
      .sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, this.maxShortTermSize);
  }

  async addMemory(message: Message): Promise<void> {
    console.log('Adding memory:', message);
    
    this.shortTermMemory.push(message);
    
    if (this.shortTermMemory.length > this.maxShortTermSize) {
      await this.compressAndStore();
    }
  }

  private async compressAndStore(): Promise<void> {
    try {
      const oldestMemories = this.shortTermMemory.slice(0, 5);
      const compressedContent = oldestMemories
        .map(m => `${m.role}: ${m.content}`)
        .join('\n');

      const { error } = await supabase
        .from('ai_memory_buffers')
        .insert({
          content: compressedContent,
          type: 'summary',
          conversation_id: this.conversationId,
          metadata: {
            compressed_from: oldestMemories.length,
            timestamp: new Date().toISOString()
          }
        });

      if (error) throw error;

      this.shortTermMemory = this.shortTermMemory.slice(5);
      
    } catch (error) {
      console.error('Error compressing memory:', error);
    }
  }
}