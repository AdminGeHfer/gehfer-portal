import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Import components directly instead of using dynamic imports
import Hub from "./Hub";
import AIHub from "./AIHub";
import Chat from "./Chat";

const Intelligence = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/hub" element={<AIHub />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:conversationId" element={<Chat />} />
        <Route path="*" element={<Navigate to="/intelligence" replace />} />
      </Routes>
    </Suspense>
  );
};

export default Intelligence;