// src/routes/QualityRoutes.tsx
import React, { lazy } from "react";
import { Routes, Route, useParams } from "react-router-dom";

const WorkflowEditor = lazy(() => import("@/pages/quality/workflow/WorkflowEditor"));
const RNCHome = lazy(() => import("@/pages/quality/home/RNCHome"));
const RNCDetails = lazy(() => import("@/pages/quality/rnc/RNCDetails").then(module => ({ 
  default: module.RNCDetails})));

const RNCDetailsWrapper = () => {
  const { id } = useParams();
  return <RNCDetails id={id} />;
};

const QualityRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RNCHome />} />
      <Route path="/home" element={<RNCHome />} />
      <Route path="/workflow" element={<WorkflowEditor />} />
      <Route path="/rnc/:id" element={<RNCDetailsWrapper />} />
    </Routes>
  );
};

export default QualityRoutes;
