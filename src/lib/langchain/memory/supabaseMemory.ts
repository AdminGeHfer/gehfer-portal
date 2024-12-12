import { BaseMemory } from "langchain/memory";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/ai";

export interface SupabaseMemoryInput {
  conversationId: string;
  returnMessages?: boolean;
}

export class SupabaseBufferMemory extends BaseMemory {
  private conversationId: string;
  private returnMessages: boolean;

  constructor({ conversationId, returnMessages = true }: SupabaseMemoryInput) {
    super();
    this.conversationId = conversationId;
    this.returnMessages = returnMessages;
  }

  async loadMemoryVariables() {
    const { data: memories, error } = await supabase
      .from('ai_memory_buffers')
      .select('*')
      .eq('conversation_id', this.conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading memory:', error);
      return { history: [] };
    }

    const messages = memories?.map(memory => ({
      type: memory.type,
      content: memory.content,
      metadata: memory.metadata
    })) || [];

    return {
      history: this.returnMessages ? messages : messages.map(m => m.content).join('\n')
    };
  }

  async saveContext(inputValues: { input: string }, outputValues: { response: string }) {
    const { input, response } = { ...inputValues, ...outputValues };

    try {
      // Save user message
      await supabase.from('ai_memory_buffers').insert({
        conversation_id: this.conversationId,
        content: input,
        type: 'message',
        metadata: { role: 'user' }
      });

      // Save assistant response
      await supabase.from('ai_memory_buffers').insert({
        conversation_id: this.conversationId,
        content: response,
        type: 'message',
        metadata: { role: 'assistant' }
      });
    } catch (error) {
      console.error('Error saving to memory:', error);
    }
  }

  async clear() {
    try {
      await supabase
        .from('ai_memory_buffers')
        .delete()
        .eq('conversation_id', this.conversationId);
    } catch (error) {
      console.error('Error clearing memory:', error);
    }
  }
}