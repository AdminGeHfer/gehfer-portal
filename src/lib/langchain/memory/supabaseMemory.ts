import { BufferMemory } from "langchain/memory";
import { supabase } from "@/integrations/supabase/client";

export class SupabaseBufferMemory extends BufferMemory {
  private conversationId: string;

  constructor({ conversationId }: { conversationId: string }) {
    super();
    this.conversationId = conversationId;
  }

  async loadMemoryVariables() {
    const { data: messages } = await supabase
      .from('ai_messages')
      .select('role, content')
      .eq('conversation_id', this.conversationId)
      .order('created_at', { ascending: true });

    if (!messages?.length) return { history: [] };

    const history = messages.map(msg => ({
      type: 'message',
      content: msg.content,
      metadata: { role: msg.role }
    }));

    return { history };
  }

  async saveContext(inputValues: { input: string }, outputValues: { response: string }) {
    const { input } = inputValues;
    const { response } = outputValues;

    await supabase.from('ai_memory_buffers').insert({
      conversation_id: this.conversationId,
      content: JSON.stringify({ input, response }),
      type: 'message'
    });
  }
}