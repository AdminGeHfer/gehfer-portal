import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MessageSquare, Plus } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useConversations } from "@/hooks/useConversations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ConversationList = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { isCollapsed } = useSidebar();
  const { conversations, isLoading, createNewConversation } = useConversations();

  if (isLoading) {
    return (
      <aside className={cn(
        "h-screen border-r bg-card/50 backdrop-blur-sm transition-all duration-300",
        isCollapsed ? "w-[60px]" : "w-[280px]"
      )}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={cn(
      "h-screen border-r bg-card/50 backdrop-blur-sm transition-all duration-300",
      isCollapsed ? "w-[60px]" : "w-[280px]"
    )}>
      <div className="flex flex-col h-full">
        <div className="p-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={createNewConversation}
                  className={cn(
                    "w-full justify-start gap-2 bg-primary/90 hover:bg-primary text-primary-foreground",
                    isCollapsed && "justify-center"
                  )}
                >
                  <Plus className="h-4 w-4" />
                  {!isCollapsed && <span>Nova Conversa</span>}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  Nova Conversa
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-2 py-2">
            {conversations.map((conversation) => (
              <TooltipProvider key={conversation.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={conversation.id === conversationId ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-2 truncate transition-all duration-200",
                        conversation.id === conversationId && "bg-accent",
                        isCollapsed && "justify-center"
                      )}
                      onClick={() => navigate(`/intelligence/chat/${conversation.id}`)}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate">{conversation.title}</span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      {conversation.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};