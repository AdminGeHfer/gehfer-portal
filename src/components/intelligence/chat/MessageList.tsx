import { Message } from "@/types/ai";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, User } from "lucide-react";
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageListProps {
  messages: Message[];
}

const MessageGroup = ({ messages, isUser }: { messages: Message[], isUser: boolean }) => {
  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), "HH:mm", { locale: ptBR });
  };

  return (
    <div className={cn(
      "flex items-start gap-3",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="w-8 h-8">
        {isUser ? (
          <>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>
              <MessageSquare className="w-4 h-4" />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div className="flex-1 space-y-2">
        {messages.map((message) => (
          <ContextMenu key={message.id}>
            <ContextMenuTrigger>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="group relative"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "px-4 py-2 rounded-lg max-w-[80%] break-words",
                      isUser 
                        ? "bg-primary text-primary-foreground ml-auto rounded-tr-none"
                        : "bg-muted rounded-tl-none"
                    )}>
                      {message.content.split('\n').map((text, i) => (
                        <p key={i} className="mb-1 last:mb-0">
                          {text}
                        </p>
                      ))}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side={isUser ? "left" : "right"}>
                    {formatMessageTime(message.created_at)}
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Copiar</ContextMenuItem>
              <ContextMenuItem>Responder</ContextMenuItem>
              <ContextMenuItem className="text-destructive">Deletar</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
    </div>
  );
};

export const MessageList = ({ messages }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Group messages by user and consecutive messages
  const groupedMessages = messages.reduce((groups: Message[][], message) => {
    const lastGroup = groups[groups.length - 1];
    
    if (
      lastGroup && 
      lastGroup[0].role === message.role &&
      // Group messages within 2 minutes of each other
      Math.abs(
        new Date(lastGroup[lastGroup.length - 1].created_at).getTime() - 
        new Date(message.created_at).getTime()
      ) < 120000
    ) {
      lastGroup.push(message);
    } else {
      groups.push([message]);
    }
    
    return groups;
  }, []);

  return (
    <ScrollArea 
      ref={scrollRef}
      className="flex-1 p-4 space-y-6"
    >
      <AnimatePresence initial={false}>
        {groupedMessages.map((group, index) => (
          <motion.div
            key={group[0].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <MessageGroup 
              messages={group} 
              isUser={group[0].role === 'user'} 
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </ScrollArea>
  );
};