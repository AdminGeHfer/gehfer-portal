import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { EnhancedKnowledgeBase } from "../rag/EnhancedKnowledgeBase";
import { HierarchicalMemory } from "../memory/HierarchicalMemory";
import { Message } from "@/types/ai";
import { AIAgent } from "@/types/ai/agent";

export class EnhancedConversationChain {
  private model: ChatOpenAI;
  private knowledgeBase: EnhancedKnowledgeBase;
  private memory: HierarchicalMemory;
  private systemPrompt: string;

  constructor(config: AIAgent) {
    this.model = new ChatOpenAI({
      modelName: config.model_id === 'gpt-4o' ? 'gpt-4-turbo-preview' : 'gpt-3.5-turbo',
      temperature: config.temperature,
      maxTokens: config.max_tokens,
      topP: config.top_p,
    });

    this.knowledgeBase = new EnhancedKnowledgeBase({
      searchThreshold: config.search_threshold,
      maxResults: 5,
      reranking: true,
      semanticAnalysis: true
    });

    this.memory = new HierarchicalMemory();
    this.systemPrompt = config.system_prompt || "You are a helpful AI assistant.";
  }

  async processMessage(message: string, history: Message[] = []): Promise<string> {
    console.log('Processing message with enhanced conversation chain');

    try {
      // Get relevant documents from knowledge base
      const documents = await this.knowledgeBase.getRelevantDocuments(message);
      
      // Get relevant memories
      const relevantMemories = await this.memory.getRelevantHistory(message);
      
      // Create context from documents and memories
      const context = documents
        .map(doc => doc.pageContent)
        .join('\n\n');

      // Format conversation history including relevant memories
      const formattedHistory = [...relevantMemories, ...history]
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      // Create prompt template with enhanced context
      const promptTemplate = PromptTemplate.fromTemplate(`
        ${this.systemPrompt}

        Relevant context from knowledge base:
        ${context}

        Previous conversation and relevant memories:
        ${formattedHistory}

        Current message:
        Human: ${message}
        Assistant: Let me help you with that.
      `);

      // Create and execute chain
      const chain = RunnableSequence.from([
        promptTemplate,
        this.model,
        new StringOutputParser()
      ]);

      const response = await chain.invoke({});
      
      // Store the new message in memory
      await this.memory.addMemory({
        role: 'assistant',
        content: response,
        created_at: new Date().toISOString()
      });

      console.log('Generated response with enhanced context and memory');
      
      return response;

    } catch (error) {
      console.error('Error in conversation chain:', error);
      throw error;
    }
  }
}