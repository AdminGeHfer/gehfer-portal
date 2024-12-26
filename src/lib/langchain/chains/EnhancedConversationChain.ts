import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { EnhancedKnowledgeBase } from "../rag/EnhancedKnowledgeBase";
import { Message } from "@/types/ai";
import { AIAgent } from "@/types/ai/agent";

export class EnhancedConversationChain {
  private model: ChatOpenAI;
  private knowledgeBase: EnhancedKnowledgeBase;
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

    this.systemPrompt = config.system_prompt || "You are a helpful AI assistant.";
  }

  async processMessage(message: string, history: Message[] = []): Promise<string> {
    console.log('Processing message with enhanced conversation chain');

    try {
      // Get relevant documents
      const documents = await this.knowledgeBase.getRelevantDocuments(message);
      
      // Rerank if documents found
      const rankedDocs = await this.knowledgeBase.rerank(documents, message);

      // Create context from documents
      const context = rankedDocs
        .map(doc => doc.pageContent)
        .join('\n\n');

      // Create conversation history
      const formattedHistory = history
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      // Create prompt template
      const promptTemplate = PromptTemplate.fromTemplate(`
        ${this.systemPrompt}

        Relevant context from knowledge base:
        ${context}

        Previous conversation:
        ${formattedHistory}

        Human: ${message}
        Assistant: Let me help you with that.
      `);

      // Create chain
      const chain = RunnableSequence.from([
        promptTemplate,
        this.model,
        new StringOutputParser()
      ]);

      // Process message
      const response = await chain.invoke({});

      console.log('Generated response with context from knowledge base');
      
      return response;

    } catch (error) {
      console.error('Error in conversation chain:', error);
      throw error;
    }
  }
}