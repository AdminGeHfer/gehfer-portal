import { Message } from "@/types/ai";
import { AIAgent } from "@/types/ai/agent";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedKnowledgeBase } from "../rag/EnhancedKnowledgeBase";
import { HierarchicalMemory } from "../memory/HierarchicalMemory";

export class EnhancedConversationChain {
  private knowledgeBase: EnhancedKnowledgeBase;
  private memory: HierarchicalMemory;
  private systemPrompt: string;
  private conversationId: string;
  private config: AIAgent;

  constructor(config: AIAgent, conversationId: string) {
    this.conversationId = conversationId;
    this.config = config;
    
    this.knowledgeBase = new EnhancedKnowledgeBase({
      searchThreshold: config.search_threshold,
      maxResults: 5,
      reranking: true,
      semanticAnalysis: true
    });

    this.memory = new HierarchicalMemory({
      maxTokens: config.max_tokens,
      useSemanticCompression: true,
      conversationId: conversationId
    });
    
    this.systemPrompt = config.system_prompt || "You are a helpful AI assistant.";
  }

  async processMessage(message: string, history: Message[] = []): Promise<string> {
    console.log('Processing message with enhanced conversation chain');

    try {
      const documents = await this.knowledgeBase.getRelevantDocuments(message);
      const relevantMemories = await this.memory.getRelevantHistory(message);
      
      const context = documents
        .map(doc => doc.pageContent)
        .join('\n\n');

      const formattedHistory = [...relevantMemories, ...history]
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      console.log('Calling chat-completion function with config:', {
        model: this.config.model_id,
        useKnowledgeBase: this.config.use_knowledge_base,
        agentId: this.config.id
      });

      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: {
          messages: [
            {
              role: 'system',
              content: `${this.systemPrompt}\n\nRelevant context from knowledge base:\n${context}\n\nPrevious conversation and relevant memories:\n${formattedHistory}`
            },
            {
              role: 'user',
              content: message
            }
          ],
          model: this.config.model_id,
          temperature: this.config.temperature,
          maxTokens: this.config.max_tokens,
          topP: this.config.top_p,
          useKnowledgeBase: this.config.use_knowledge_base,
          agentId: this.config.id
        }
      });

      if (error) {
        console.error('Error calling chat-completion function:', error);
        throw error;
      }

      if (!data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from chat-completion function');
      }

      const response = data.choices[0].message.content;
      
      const newMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: this.conversationId,
        role: 'assistant',
        content: response,
        created_at: new Date().toISOString()
      };

      await this.memory.addMemory(newMessage);
      
      console.log('Generated response with enhanced context and memory');
      
      return response;

    } catch (error) {
      console.error('Error in conversation chain:', error);
      throw error;
    }
  }
}