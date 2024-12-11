import { Message } from "@/types/ai";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea 
      ref={scrollAreaRef}
      className="flex-1 p-4 space-y-4"
    >
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex items-start gap-3 ${
            message.role === 'assistant' ? 'justify-start' : 'justify-end'
          }`}
        >
          {message.role === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
          )}
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              message.role === 'assistant'
                ? 'bg-accent text-accent-foreground'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {message.content}
          </div>
          {message.role === 'user' && (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
          )}
        </motion.div>
      ))}
    </ScrollArea>
  );
};