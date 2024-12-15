import { Route, Routes, Navigate } from "react-router-dom";
import Chat from "@/pages/intelligence/Chat";
import Hub from "@/pages/intelligence/Hub";
import AIHub from "@/pages/intelligence/AIHub";

const IntelligenceRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/intelligence/hub" replace />} />
      <Route path="/hub" element={<Hub />} />
      <Route path="/ai-hub" element={<AIHub />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:conversationId" element={<Chat />} />
      <Route path="*" element={<Navigate to="/intelligence/hub" replace />} />
    </Routes>
  );
};

export default IntelligenceRoutes;