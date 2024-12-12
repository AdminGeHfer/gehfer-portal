import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const initializeConversations = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) {
          console.log('No valid session found, redirecting to login');
          navigate("/login");
          return;
        }

        const userId = session.session.user.id;
        console.log('Loading conversations for user:', userId);

        await loadConversations(userId);
        
        subscription = supabase
          .channel('ai_conversations')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'ai_conversations',
              filter: `user_id=eq.${userId}`,
            },
            async () => {
              await loadConversations(userId);
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
      console.log('Fetching conversations for user:', userId);
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading conversations:', error);
        throw error;
      }
      
      console.log('Loaded conversations:', data);
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
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
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
          user_id: session.session.user.id,
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

  return {
    conversations,
    isLoading,
    createNewConversation
  };
}