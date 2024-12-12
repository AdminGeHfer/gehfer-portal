import { Routes, Route, Navigate } from "react-router-dom";
import Hub from "./Hub";
import AIHub from "./AIHub";
import Chat from "./Chat";

const Intelligence = () => {
  return (
    <Routes>
      <Route path="/" element={<Hub />} />
      <Route path="/hub" element={<AIHub />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:conversationId" element={<Chat />} />
      <Route path="*" element={<Navigate to="/intelligence" replace />} />
    </Routes>
  );
};

export default Intelligence;