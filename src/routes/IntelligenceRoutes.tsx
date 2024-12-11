import { Route, Routes, Navigate } from "react-router-dom";
import { Chat } from "@/components/intelligence/Chat";
import { ConversationList } from "@/components/intelligence/ConversationList";

const IntelligenceRoutes = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background/80 backdrop-blur-sm">
      <ConversationList />
      <div className="flex-1">
        <Routes>
          <Route path=":conversationId" element={<Chat />} />
          <Route path="/" element={
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Selecione ou crie uma nova conversa para começar</p>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default IntelligenceRoutes;