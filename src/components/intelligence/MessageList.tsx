import { Message } from "@/types/ai";
import { motion } from "framer-motion";
import { MessageSquare, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useRef } from "react";

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
      className="flex-1 p-4 space-y-4 bg-gradient-to-b from-background/50 to-background/80 backdrop-blur-xl"
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
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
          )}
          
          <div className={`group relative max-w-[80%] space-y-1`}>
            <div
              className={`
                rounded-2xl p-3 shadow-sm
                ${message.role === 'assistant' 
                  ? 'bg-card text-card-foreground rounded-tl-none' 
                  : 'bg-primary text-primary-foreground rounded-tr-none'
                }
              `}
            >
              {message.content}
            </div>
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
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