import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Hub = lazy(() => import("@/pages/intelligence-v2/Hub"));
const Chat = lazy(() => import("@/pages/intelligence-v2/Chat"));
const Settings = lazy(() => import("@/pages/intelligence-v2/Settings"));

const IntelligenceV2Routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/intelligence-v2/hub" replace />} />
      <Route path="/hub" element={<Hub />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:conversationId" element={<Chat />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/intelligence-v2/hub" replace />} />
    </Routes>
  );
};

export default IntelligenceV2Routes;