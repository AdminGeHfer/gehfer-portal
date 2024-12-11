import { Route, Routes } from "react-router-dom";
import Hub from "@/pages/intelligence/Hub";
import Chat from "@/pages/intelligence/Chat";

const IntelligenceRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Hub />} />
      <Route path="/hub" element={<Hub />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:conversationId" element={<Chat />} />
    </Routes>
  );
};

export default IntelligenceRoutes;