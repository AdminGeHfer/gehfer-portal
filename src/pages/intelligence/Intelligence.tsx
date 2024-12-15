import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Hub from "./Hub";
import Training from "./Training";
import Chat from "./Chat";
import AIHub from "./AIHub";

const Intelligence = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/hub" element={<AIHub />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:conversationId" element={<Chat />} />
        <Route path="/training" element={<Training />} />
        <Route path="*" element={<Navigate to="/intelligence" replace />} />
      </Routes>
    </Suspense>
  );
};

export default Intelligence;