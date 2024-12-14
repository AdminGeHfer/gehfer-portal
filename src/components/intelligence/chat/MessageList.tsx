import { Message } from "@/types/ai";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, User, Paperclip } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);

  const renderMessageContent = (content: string) => {
    const fileMatch = content.match(/\[Arquivo anexado: (.*?)\]\((.*?)\)/);
    if (fileMatch) {
      const [, fileName, fileUrl] = fileMatch;
      return (
        <div className="flex items-center space-x-2 bg-accent/50 rounded-lg p-2">
          <Paperclip className="h-4 w-4" />
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            {fileName}
          </a>
        </div>
      );
    }
    return content;
  };

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), "HH:mm", { locale: ptBR });
  };

  return (
    <ScrollArea 
      ref={scrollAreaRef}
      className="flex-1 p-4 space-y-4 overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 13rem)" }}
    >
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex items-start gap-3",
              message.role === 'assistant' ? "justify-start" : "flex-row-reverse"
            )}
          >
            <div className={cn(
              "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              message.role === 'assistant' 
                ? "bg-primary/10 text-primary" 
                : "bg-secondary/10 text-secondary-foreground"
            )}>
              {message.role === 'assistant' 
                ? <MessageSquare className="w-4 h-4" />
                : <User className="w-4 h-4" />
              }
            </div>
            <div className="group relative max-w-[80%] space-y-1">
              <div className={cn(
                "rounded-lg p-3",
                message.role === 'assistant'
                  ? "bg-accent/50 backdrop-blur-sm text-accent-foreground"
                  : "bg-primary/90 backdrop-blur-sm text-primary-foreground"
              )}>
                {renderMessageContent(message.content)}
              </div>
              <span className={cn(
                "text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity",
                message.role === 'assistant' ? "text-left" : "text-right"
              )}>
                {formatMessageTime(message.created_at)}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </ScrollArea>
  );
};