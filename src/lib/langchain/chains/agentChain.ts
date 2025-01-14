/* @ai-protected
 * type: "agent-chain"
 * status: "optimized"
 * version: "2.2"
 * features: [
 *   "knowledge-base-integration",
 *   "dynamic-prompts",
 *   "context-awareness"
 * ]
 * checksum: "f8e7c3b2a1"
 */

import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { AIAgent } from "@/types/ai/agent";
import { EnhancedRetriever } from "../rag/enhancedRetrieval";
import { RunnableSequence } from "@langchain/core/runnables";

interface Message {
  content: string;
}

export const createAgentChain = async (
  agent: AIAgent,
  memory,
  previousMessages: Message[] = []
) => {
  console.log('[AgentChain] Creating agent chain with config:', {
    model: agent.model_id,
    useKnowledgeBase: agent.use_knowledge_base
  });

  const model = new ChatOpenAI({
    modelName: agent.model_id === 'gpt-4o' ? 'gpt-4' : 'gpt-3.5-turbo',
    temperature: agent.temperature,
    maxTokens: agent.max_tokens,
    topP: agent.top_p,
  });

  let contextualPrompt = agent.system_prompt || "You are a helpful AI assistant.";
  let retriever: EnhancedRetriever | undefined;
  
  if (agent.use_knowledge_base) {
    console.log('[AgentChain] Initializing knowledge base integration');
    
    retriever = new EnhancedRetriever({
      chunkSize: agent.chunk_size,
      chunkOverlap: agent.chunk_overlap,
      dynamicThreshold: true,
      searchThreshold: 0.4,
      maxResults: 5
    });

    contextualPrompt += `\n\nI have access to a knowledge base and will use it to provide accurate information. When answering, I will use the context provided from the knowledge base.`;
  }

  const prompt = PromptTemplate.fromTemplate(`
    ${contextualPrompt}
    
    Current conversation:
    {chat_history}
    
    ${agent.use_knowledge_base ? 'Relevant context from knowledge base:\n{context}\n\n' : ''}
    
    Human: {input}
    Assistant: `);

  let chain: ConversationChain;

  if (retriever) {
    console.log('[AgentChain] Setting up retriever chain');
    
    const retrieverChain = RunnableSequence.from([
      {
        input: (input) => input.input,
        chat_history: (input) => input.chat_history,
      },
      {
        context: async (input) => {
          console.log('[AgentChain] Retrieving context for:', input.input);
          const docs = await retriever.getRelevantDocuments(input.input);
          const context = docs.map(doc => doc.pageContent).join('\n\n');
          console.log('[AgentChain] Retrieved context:', context.substring(0, 200) + '...');
          return context;
        },
        chat_history: (input) => input.chat_history,
        input: (input) => input.input,
      },
    ]);

    chain = new ConversationChain({
      llm: model,
      memory,
      prompt,
      // @ts-expect-error - Type issues with latest LangChain version
      retriever: retrieverChain,
    });
  } else {
    chain = new ConversationChain({
      llm: model,
      memory,
      prompt,
    });
  }

  // Adicionar mensagens anteriores à memória
  for (const message of previousMessages) {
    await memory.saveContext(
      { input: message.content },
      { output: "" }
    );
  }

  console.log('[AgentChain] Agent chain created successfully');
  return chain;
};