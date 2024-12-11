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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadConversations();
    subscribeToConversations();
  }, []);

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error loading conversations",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setConversations(data as Conversation[]);
  };

  const subscribeToConversations = () => {
    const subscription = supabase
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

    return () => {
      subscription.unsubscribe();
    };
  };

  const createNewConversation = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('ai_conversations')
      .insert({
        title: 'Nova Conversa',
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating conversation",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    navigate(`/intelligence/chat/${data.id}`);
  };

  return (
    <div className="w-64 border-r border-border h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-4">
        <Button 
          onClick={createNewConversation}
          className="w-full"
          variant="outline"
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