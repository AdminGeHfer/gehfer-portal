import { Route, Routes, Navigate } from "react-router-dom";
import Chat from "@/pages/intelligence/Chat";
import Hub from "@/pages/intelligence/Hub";

const IntelligenceRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Hub />} />
      <Route path="/hub" element={<Hub />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:conversationId" element={<Chat />} />
      <Route path="*" element={<Navigate to="/intelligence/hub" replace />} />
    </Routes>
  );
};

export default IntelligenceRoutes;