import { ChatOpenAI } from "@langchain/openai";
import { BufferMemory } from "langchain/memory";
import { createConversationChain } from "../chains/conversation";
import { createMemoryFromMessages } from "../memory";
import { Message } from "@/types/ai";
import { AIAgent } from "@/types/ai/agent";

export class BaseAgent {
  private llm: ChatOpenAI;
  private memory: BufferMemory;
  private chain;
  private config: AIAgent;

  constructor(config: AIAgent, messages: Message[] = []) {
    this.config = config;
    this.llm = new ChatOpenAI({
      modelName: config.model_id,
      temperature: config.temperature,
      maxTokens: config.max_tokens,
      topP: config.top_p,
    });
    this.memory = createMemoryFromMessages(messages);
    this.chain = createConversationChain(
      this.llm,
      this.memory,
      config.system_prompt
    );
  }

  async processMessage(message: string): Promise<string> {
    try {
      const response = await this.chain.call({ input: message });
      return response.response;
    } catch (error) {
      console.error("Error processing message:", error);
      throw error;
    }
  }
}