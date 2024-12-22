import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const Intelligence = lazy(() => import("@/pages/intelligence/Intelligence"));
const DoclingPOC = lazy(() => import("@/pages/intelligence/DoclingPOC"));

const IntelligenceRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/intelligence/hub" replace />} />
      <Route path="/hub" element={<Intelligence />} />
      <Route path="/docling-poc" element={<DoclingPOC />} />
      <Route path="*" element={<Navigate to="/intelligence/hub" replace />} />
    </Routes>
  );
};

export default IntelligenceRoutes;