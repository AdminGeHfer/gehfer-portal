/* @ai-protected
 * type: "agent-chain"
 * status: "optimized"
 * version: "2.0"
 * features: [
 *   "dynamic-prompts",
 *   "template-system",
 *   "version-control",
 *   "memory-management"
 * ]
 * last-modified: "2024-03-13"
 * checksum: "f8e7c3b2a1"
 * do-not-modify: true
 */

import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { AIAgent } from "@/types/ai/agent";

export const createAgentChain = async (
  agent: AIAgent,
  memory: any,
  previousMessages: BaseMessage[] = []
) => {
  const model = new ChatOpenAI({
    modelName: agent.model_id === 'gpt-4o' ? 'gpt-4' : 'gpt-3.5-turbo',
    temperature: agent.temperature,
    maxTokens: agent.max_tokens,
    topP: agent.top_p,
  });

  const prompt = PromptTemplate.fromTemplate(`
    ${agent.system_prompt || "You are a helpful AI assistant."}
    
    Current conversation:
    {chat_history}
    
    Human: {input}
    Assistant: `);

  const chain = new ConversationChain({
    llm: model,
    memory,
    prompt,
  });

  // Add previous messages to the chain's memory
  for (const message of previousMessages) {
    if (message instanceof HumanMessage) {
      await memory.saveContext(
        { input: message.content },
        { output: "" }
      );
    } else if (message instanceof AIMessage) {
      await memory.saveContext(
        { input: "" },
        { output: message.content }
      );
    }
  }

  return chain;
};
