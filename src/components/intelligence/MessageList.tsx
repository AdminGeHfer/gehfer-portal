import { Message } from "@/types/ai";
import { motion } from "framer-motion";
import { MessageSquare, User, Paperclip } from "lucide-react";
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

  const renderMessageContent = (content: string) => {
    // Check if the message contains a file attachment
    const fileMatch = content.match(/\[Arquivo anexado: (.*?)\]\((.*?)\)/);
    if (fileMatch) {
      const [, fileName, fileUrl] = fileMatch;
      return (
        <div className="flex items-center space-x-2">
          <Paperclip className="h-4 w-4" />
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            {fileName}
          </a>
        </div>
      );
    }
    return content;
  };

  return (
    <ScrollArea 
      ref={scrollAreaRef}
      className="flex-1 p-6 space-y-6"
    >
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex items-start gap-4 ${
            message.role === 'assistant' ? 'justify-start' : 'flex-row-reverse'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            message.role === 'assistant' 
              ? 'bg-primary/10 text-primary' 
              : 'bg-secondary/10 text-secondary-foreground'
          }`}>
            {message.role === 'assistant' 
              ? <MessageSquare className="w-4 h-4" />
              : <User className="w-4 h-4" />
            }
          </div>
          <div
            className={`max-w-[80%] rounded-lg p-4 ${
              message.role === 'assistant'
                ? 'bg-accent text-accent-foreground'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {renderMessageContent(message.content)}
          </div>
        </motion.div>
      ))}
    </ScrollArea>
  );
};