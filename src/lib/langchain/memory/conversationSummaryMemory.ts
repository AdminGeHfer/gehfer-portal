import { ConversationSummaryMemory } from "langchain/memory";
import { ChatMessageHistory } from "langchain/memory";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { Message } from "@/types/ai";

export const createSummaryMemory = async (messages: Message[], returnMessages = true) => {
  console.log('Creating summary memory with', messages.length, 'messages');
  
  const history = new ChatMessageHistory();
  
  for (const msg of messages) {
    if (msg.role === 'system') {
      await history.addMessage(new SystemMessage(msg.content));
    } else if (msg.role === 'user') {
      await history.addMessage(new HumanMessage(msg.content));
    } else if (msg.role === 'assistant') {
      await history.addMessage(new AIMessage(msg.content));
    }
  }

  return new ConversationSummaryMemory({
    llm: new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0 }),
    chatHistory: history,
    returnMessages,
    memoryKey: "chat_history",
  });
};