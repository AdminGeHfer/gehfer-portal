import { BufferMemory, ConversationSummaryMemory } from "langchain/memory";
import { ChatMessageHistory } from "langchain/memory";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { Message } from "@/types/ai";
import { OpenAI } from "@langchain/openai";

export const createConversationMemory = async (messages: Message[], useConversationSummary: boolean = false) => {
  const history = new ChatMessageHistory();
  
  // Convert existing messages to LangChain format
  for (const msg of messages) {
    if (msg.role === 'user') {
      await history.addMessage(new HumanMessage(msg.content));
    } else if (msg.role === 'assistant') {
      await history.addMessage(new AIMessage(msg.content));
    }
  }

  if (useConversationSummary) {
    return new ConversationSummaryMemory({
      llm: new OpenAI({ temperature: 0, modelName: "gpt-4o-mini" }),
      chatHistory: history,
      returnMessages: true,
      memoryKey: "chat_history",
    });
  }

  return new BufferMemory({
    chatHistory: history,
    returnMessages: true,
    memoryKey: "chat_history",
  });
};