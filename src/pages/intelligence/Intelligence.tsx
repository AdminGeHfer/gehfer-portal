import { Routes, Route, Navigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Chat } from "@/components/intelligence/Chat";

const Intelligence = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="GeHfer Intelligence" 
        subtitle="Central de Inteligência Artificial" 
      />
      <Routes>
        <Route path="/chat/*" element={<Chat />} />
        <Route path="/" element={<Navigate to="/intelligence/chat" replace />} />
        <Route path="*" element={<Navigate to="/intelligence/chat" replace />} />
      </Routes>
    </div>
  );
};

export default Intelligence;