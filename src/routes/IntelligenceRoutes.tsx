import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { useAIAgents } from "@/hooks/useAIAgents";

const Chat = lazy(() => import("@/pages/intelligence/Chat"));
const Hub = lazy(() => import("@/pages/intelligence/Hub"));
const Training = lazy(() => import("@/pages/intelligence/Training"));

const IntelligenceRoutes = () => {
  const { agents, isLoading } = useAIAgents();

  return (
    <Routes>
      <Route path="/" element={<Hub />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:conversationId" element={<Chat />} />
      <Route path="/training" element={<Training />} />
    </Routes>
  );
};

export default IntelligenceRoutes;