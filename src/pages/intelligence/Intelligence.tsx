import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const Hub = lazy(() => import("./Hub"));
const DoclingPOC = lazy(() => import("./DoclingPOC"));
const Chat = lazy(() => import("./Chat"));

const Intelligence = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/intelligence/hub" replace />} />
      <Route path="/hub" element={<Hub />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/docling-poc" element={<DoclingPOC />} />
      <Route path="*" element={<Navigate to="/intelligence/hub" replace />} />
    </Routes>
  );
};

export default Intelligence;