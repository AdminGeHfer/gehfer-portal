import { Route, Routes, Navigate } from "react-router-dom";
import { ConversationList } from "@/components/intelligence/ConversationList";
import { Chat } from "@/components/intelligence/Chat";

const IntelligenceRoutes = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ConversationList />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/chat/:conversationId" element={<Chat />} />
          <Route path="/chat" element={
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                Selecione ou crie uma nova conversa para começar
              </p>
            </div>
          } />
          <Route path="/" element={<Navigate to="/chat" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default IntelligenceRoutes;