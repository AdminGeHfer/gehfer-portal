import { Message } from "@/types/ai";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, User } from "lucide-react";
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), "HH:mm", { locale: ptBR });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              message.role === 'assistant' ? "justify-start" : "justify-end"
            )}
          >
            {message.role === 'assistant' && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
            )}
            
            <div className="group relative max-w-[80%] space-y-1">
              <div className={cn(
                "rounded-2xl p-3 shadow-sm",
                message.role === 'assistant'
                  ? "bg-card text-card-foreground rounded-tl-none"
                  : "bg-primary text-primary-foreground rounded-tr-none"
              )}>
                {message.content}
              </div>
              <span className={cn(
                "text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity",
                message.role === 'assistant' ? "text-left" : "text-right"
              )}>
                {formatMessageTime(message.created_at)}
              </span>
            </div>

            {message.role === 'user' && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
};