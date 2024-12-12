import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { MessageSquare, Plus } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useToast } from "@/components/ui/use-toast";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export const ConversationList = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { isCollapsed } = useSidebar();
  const { toast } = useToast();

  useEffect(() => {
    const initializeConversations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      await loadConversations();
      const subscription = subscribeToConversations();
      return () => {
        subscription?.unsubscribe();
      };
    };

    initializeConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToConversations = () => {
    return supabase
      .channel('ai_conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_conversations',
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();
  };

  const createNewConversation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a conversation",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          title: 'Nova Conversa',
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      navigate(`/intelligence/chat/${data.id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create new conversation",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <aside className={cn(
        "h-screen border-r bg-background transition-all duration-300",
        isCollapsed ? "w-[60px]" : "w-[250px]"
      )}>
        <div className="flex items-center justify-center h-full">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </aside>
    );
  }

  return (
    <aside className={cn(
      "h-screen border-r bg-background transition-all duration-300",
      isCollapsed ? "w-[60px]" : "w-[250px]"
    )}>
      <div className="flex flex-col h-full">
        <div className="p-3">
          <Button
            onClick={createNewConversation}
            className="w-full justify-start gap-2"
          >
            <Plus className="h-4 w-4" />
            {!isCollapsed && <span>Nova Conversa</span>}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-2 py-2">
            {conversations.map((conversation) => (
              <Button
                key={conversation.id}
                variant={conversation.id === conversationId ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2 truncate",
                  conversation.id === conversationId && "bg-accent"
                )}
                onClick={() => navigate(`/intelligence/chat/${conversation.id}`)}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                {!isCollapsed && (
                  <span className="truncate">{conversation.title}</span>
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};