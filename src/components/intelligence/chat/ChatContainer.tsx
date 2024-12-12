import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/ai";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { truncateMessages } from "@/utils/chatUtils";

export const ChatContainer = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [model, setModel] = useState("gpt-4o-mini");
  const [agentId, setAgentId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (conversationId) {
      loadMessages();
      loadConversationDetails();
      const subscription = subscribeToMessages();
      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [conversationId]);

  const loadConversationDetails = async () => {
    if (!conversationId) return;
    
    try {
      const { data: conversation, error } = await supabase
        .from('ai_conversations')
        .select('title')
        .eq('id', conversationId)
        .single();

      if (error) throw error;

      // Extract agent ID from title if it's a chat with an agent
      if (conversation.title.startsWith('Chat with ')) {
        const { data: agent, error: agentError } = await supabase
          .from('ai_agents')
          .select('id')
          .eq('name', conversation.title.replace('Chat with ', ''))
          .single();

        if (!agentError && agent) {
          setAgentId(agent.id);
        }
      }
    } catch (error) {
      console.error('Error loading conversation details:', error);
    }
  };

  const loadMessages = async () => {
    if (!conversationId) return;
    
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data as Message[]);
      
    } catch (error: any) {
      console.error('Error loading messages:', error);
      toast({
        title: "Erro ao carregar mensagens",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const subscribeToMessages = () => {
    if (!conversationId) return;

    return supabase
      .channel('ai_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();
  };

  const handleSubmit = async (content: string) => {
    if (!conversationId || isLoading || !content.trim()) return;

    setIsLoading(true);

    try {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      };

      const { error: saveError } = await supabase
        .from('ai_messages')
        .insert(userMessage);

      if (saveError) throw saveError;

      // Get truncated messages for the API call
      const truncatedMessages = truncateMessages(
        [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
        model
      );

      const response = await supabase.functions.invoke('chat-completion', {
        body: { 
          messages: truncatedMessages,
          model,
          agentId // Pass the agent ID to use its configuration
        },
      });

      if (response.error) {
        if (response.error.message?.includes('Limite de tokens excedido') ||
            response.error.message?.includes('conversa ficou muito longa')) {
          toast({
            title: "Limite de mensagens atingido",
            description: "A conversa ficou muito longa. Por favor, crie uma nova conversa ou use um modelo diferente.",
            variant: "destructive",
          });
          return;
        }
        throw response.error;
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        role: 'assistant',
        content: response.data.choices[0].message.content,
        created_at: new Date().toISOString(),
      };

      const { error: saveAiError } = await supabase
        .from('ai_messages')
        .insert(assistantMessage);

      if (saveAiError) throw saveAiError;

    } catch (error: any) {
      console.error('Error in chat flow:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Ocorreu um erro ao processar sua mensagem",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async () => {
    if (!conversationId || isDeleting) return;

    setIsDeleting(true);
    try {
      const { error: deleteMessagesError } = await supabase
        .from('ai_messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (deleteMessagesError) throw deleteMessagesError;

      const { error: deleteConversationError } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', conversationId);

      if (deleteConversationError) throw deleteConversationError;

      toast({
        title: "Conversa excluída",
        description: "A conversa foi excluída com sucesso.",
      });

      navigate('/intelligence/chat');
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Erro ao excluir conversa",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(filePath);

      const content = `[Arquivo anexado: ${file.name}](${publicUrl})`;
      await handleSubmit(content);

      toast({
        title: "Arquivo enviado",
        description: "O arquivo foi enviado com sucesso.",
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erro ao enviar arquivo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!conversationId) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        onDelete={handleDeleteConversation} 
        isDeleting={isDeleting}
        model={model}
        onModelChange={setModel}
        isLoading={isLoading}
      />
      
      <Card className="flex-1 overflow-hidden backdrop-blur-sm bg-card/30 border-0">
        <MessageList messages={messages} />
        <ChatInput 
          onSubmit={handleSubmit} 
          onFileUpload={handleFileUpload}
          isLoading={isLoading} 
        />
      </Card>
    </div>
  );
};