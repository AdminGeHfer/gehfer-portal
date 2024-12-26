import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const Intelligence = lazy(() => import("@/pages/intelligence/Intelligence"));
const AIHub = lazy(() => import("@/pages/intelligence/AIHub"));
const Chat = lazy(() => import("@/pages/intelligence/Chat"));
const DoclingPOC = lazy(() => import("@/pages/intelligence/DoclingPOC"));

const IntelligenceRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Intelligence />}>
        <Route index element={<Navigate to="hub" replace />} />
        <Route path="hub" element={<AIHub />} />
        <Route path="chat" element={<Chat />} />
        <Route path="chat/:conversationId" element={<Chat />} />
        <Route path="docling-poc" element={<DoclingPOC />} />
        <Route path="*" element={<Navigate to="hub" replace />} />
      </Route>
    </Routes>
  );
};

export default IntelligenceRoutes;