import { Message } from "@/types/ai";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, User, Quote, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import { Virtuoso } from 'react-virtuoso';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import emojiData from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MessageListProps {
  messages: Message[];
}

const MessageGroup = ({ messages, isUser }: { messages: Message[], isUser: boolean }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), "HH:mm", { locale: ptBR });
  };

  const handleQuote = (content: string) => {
    setSelectedMessage(content);
    // You can implement the quote functionality here
    // For example, updating the input field with the quoted text
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
                      <ReactMarkdown className="prose dark:prose-invert max-w-none">
                        {message.content}
                      </ReactMarkdown>
                      
                      {selectedMessage === message.content && (
                        <div className="mt-2 p-2 border-l-2 border-primary/50 bg-primary/10 rounded">
                          <Quote className="w-4 h-4 mb-1" />
                          <ReactMarkdown className="prose dark:prose-invert max-w-none text-sm">
                            {selectedMessage}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side={isUser ? "left" : "right"}>
                    {formatMessageTime(message.created_at)}
                  </TooltipContent>
                </Tooltip>

                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                    <PopoverTrigger asChild>
                      <button className="p-1 hover:bg-accent rounded">
                        <Smile className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Picker 
                        data={emojiData}
                        onEmojiSelect={console.log}
                        theme="light"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </motion.div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => handleQuote(message.content)}>
                <Quote className="w-4 h-4 mr-2" />
                Citar
              </ContextMenuItem>
              <ContextMenuItem onClick={() => navigator.clipboard.writeText(message.content)}>
                Copiar
              </ContextMenuItem>
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

  // Group messages by user and consecutive messages
  const groupedMessages = messages.reduce((groups: Message[][], message) => {
    const lastGroup = groups[groups.length - 1];
    
    if (
      lastGroup && 
      lastGroup[0].role === message.role &&
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-background/50 to-background/80 backdrop-blur-xl"
    >
      <Virtuoso
        style={{ height: '100%' }}
        data={groupedMessages}
        followOutput="smooth"
        itemContent={(index, group) => (
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
        )}
      />
    </div>
  );
};