import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Conversation } from "@/types/ai";

export const ConversationList = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadConversations();
    const subscription = subscribeToConversations();
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConversations(data as Conversation[]);
      
    } catch (error: any) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Erro ao carregar conversas",
        description: error.message,
        variant: "destructive",
      });
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
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          title: 'Nova Conversa',
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      console.log('New conversation created:', data);
      navigate(`/intelligence/chat/${data.id}`);
      
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Erro ao criar conversa",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-64 border-r border-border h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-4">
        <Button 
          onClick={createNewConversation}
          className="w-full"
          variant="outline"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Conversa
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {conversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate(`/intelligence/chat/${conversation.id}`)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {conversation.title}
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};