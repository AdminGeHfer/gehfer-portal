import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const WorkflowEditor = lazy(() => import("@/pages/quality/workflow/WorkflowEditor"));
const RNCHome = lazy(() => import("@/pages/quality/home/RNCHome"));
const RNCDetails = lazy(() => import("@/pages/quality/rnc/RNCDetails"));

const QualityRoutes = () => {
  return (
    <Routes>
      <Route path="/workflow" element={<WorkflowEditor />} />
      <Route path="/home" element={<RNCHome />} />
      <Route path="/rnc/:id" element={<RNCDetails />} />
    </Routes>
  );
};

export default QualityRoutes;