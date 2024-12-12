import { Route, Routes, Navigate } from "react-router-dom";
import { Chat } from "@/components/intelligence/Chat";
import { ConversationList } from "@/components/intelligence/ConversationList";
import Hub from "@/pages/intelligence/Hub";

const IntelligenceRoutes = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background/80 backdrop-blur-sm">
      <Routes>
        <Route path="/hub" element={<Hub />} />
        <Route path="/chat" element={
          <div className="flex w-full">
            <ConversationList />
            <div className="flex-1">
              <Chat />
            </div>
          </div>
        } />
        <Route path="/" element={<Navigate to="hub" replace />} />
      </Routes>
    </div>
  );
};

export default IntelligenceRoutes;