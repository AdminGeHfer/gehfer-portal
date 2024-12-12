import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { Message } from "@/types/ai";

export const createMemoryFromMessages = (messages: Message[]) => {
  const history = new ChatMessageHistory();
  
  // Converter mensagens existentes para o formato do LangChain
  messages.forEach(msg => {
    if (msg.role === 'user') {
      history.addMessage(new HumanMessage(msg.content));
    } else if (msg.role === 'assistant') {
      history.addMessage(new AIMessage(msg.content));
    }
  });

  return new BufferMemory({
    chatHistory: history,
    returnMessages: true,
    memoryKey: "chat_history",
  });
};