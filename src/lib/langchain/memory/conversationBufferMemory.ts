import { BufferMemory } from "langchain/memory";
import { ChatMessageHistory } from "langchain/memory";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Message } from "@/types/ai";

export const createBufferMemory = async (messages: Message[], returnMessages = true) => {
  console.log('Creating buffer memory with', messages.length, 'messages');
  
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

  return new BufferMemory({
    chatHistory: history,
    returnMessages,
    memoryKey: "chat_history",
  });
};