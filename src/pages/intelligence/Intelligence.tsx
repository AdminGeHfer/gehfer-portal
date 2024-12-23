import { Routes, Route, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import Hub from "./Hub";
import Chat from "./Chat";
import DoclingPOC from "./DoclingPOC";

const Intelligence = () => {
  return (
    <div className="flex flex-col h-full">
      <Header title="GeHfer Intelligence" />
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="chat" element={<Chat />} />
          <Route path="docling-poc" element={<DoclingPOC />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Intelligence;