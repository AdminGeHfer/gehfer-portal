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
    let subscription: { unsubscribe: () => void } | null = null;

    const initializeConversations = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        
        if (!user) {
          setIsLoading(false);
          navigate("/login");
          return;
        }

        await loadConversations(user.id);
        
        // Set up subscription with user context
        subscription = supabase
          .channel('ai_conversations')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'ai_conversations',
              filter: `user_id=eq.${user.id}`,
            },
            async () => {
              await loadConversations(user.id);
            }
          )
          .subscribe();
        
      } catch (error) {
        console.error('Error initializing conversations:', error);
        toast({
          title: "Error",
          description: "Failed to initialize conversations",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeConversations();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [navigate, toast]);

  const loadConversations = async (userId: string) => {
    if (!userId) {
      console.error('No user ID provided to loadConversations');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    }
  };

  const createNewConversation = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a conversation",
          variant: "destructive",
        });
        navigate("/login");
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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