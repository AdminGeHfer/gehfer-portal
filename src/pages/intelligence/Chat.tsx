import { ConversationList } from "@/components/intelligence/ConversationList";
import { Chat as ChatComponent } from "@/components/intelligence/Chat";
import { Header } from "@/components/layout/Header";
import { useParams } from "react-router-dom";
import * as React from "react";

const Chat = () => {
  const { conversationId } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="GeHfer Intelligence Chat" 
        subtitle="Interface unificada de conversação com IA" 
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <ConversationList />
        <div className="flex-1 p-4">
          {conversationId ? (
            <ChatComponent />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Selecione ou crie uma nova conversa para começar
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;