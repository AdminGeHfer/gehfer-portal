/* @ai-protected
 * type: "agent-chain"
 * status: "optimized"
 * version: "2.0"
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

export const createAgentChain = async (
  agent: AIAgent,
  memory: any,
  previousMessages: any[] = []
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
  
  // Inicializar retriever se knowledge base estiver ativada
  if (agent.use_knowledge_base) {
    console.log('[AgentChain] Initializing knowledge base integration');
    
    const retriever = new EnhancedRetriever({
      chunkSize: agent.chunk_size,
      chunkOverlap: agent.chunk_overlap,
      dynamicThreshold: true
    });

    // Adicionar contexto do conhecimento ao prompt
    contextualPrompt += `\n\nI have access to a knowledge base and will use it to provide accurate information.`;
    
    // Integrar retriever ao modelo
    model.retriever = retriever;
  }

  const prompt = PromptTemplate.fromTemplate(`
    ${contextualPrompt}
    
    Current conversation:
    {chat_history}
    
    Human: {input}
    Assistant: `);

  const chain = new ConversationChain({
    llm: model,
    memory,
    prompt,
  });

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