import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { AIAgent } from "@/types/ai/agent";
import { HierarchicalMemory } from "../memory/hierarchicalMemory";
import { EnhancedRetriever } from "../rag/enhancedRetrieval";

export const createEnhancedAgentChain = async (
  agent: AIAgent,
  existingMessages: any[] = []
) => {
  // Initialize enhanced memory
  const memory = new HierarchicalMemory({
    maxTokens: agent.max_tokens,
    useSemanticCompression: true
  });

  // Initialize enhanced retriever
  const retriever = new EnhancedRetriever({
    reranking: true,
    semanticAnalysis: true,
    dynamicThreshold: true,
    chunkSize: agent.chunk_size,
    chunkOverlap: agent.chunk_overlap,
    searchThreshold: 0.4,
    maxResults: 5
  });

  // Initialize language model with agent configuration
  const model = new ChatOpenAI({
    modelName: mapModelId(agent.model_id),
    temperature: agent.temperature,
    maxTokens: agent.max_tokens,
    topP: agent.top_p,
  });

  // Create dynamic prompt template
  const promptTemplate = createDynamicPromptTemplate(agent);

  // Create enhanced conversation chain
  const chain = new ConversationChain({
    llm: model,
    memory,
    prompt: promptTemplate,
  });

  // Initialize memory with existing messages
  for (const message of existingMessages) {
    await memory.saveContext(
      { input: message.content },
      { output: "" }
    );
  }

  return chain;
};

const mapModelId = (modelId: string): string => {
  const modelMap: Record<string, string> = {
    'gpt-4o': 'gpt-4',
    'gpt-4o-mini': 'gpt-3.5-turbo',
  };
  return modelMap[modelId] || modelId;
};

const createDynamicPromptTemplate = (agent: AIAgent): PromptTemplate => {
  const basePrompt = agent.system_prompt || "You are a helpful AI assistant.";
  
  return PromptTemplate.fromTemplate(`
    ${basePrompt}
    
    Current conversation:
    {chat_history}
    
    Human: {input}
    Assistant: Let me help you with that.
  `);
};