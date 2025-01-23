import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const WorkflowEditor = lazy(() => import("@/pages/quality/workflow/WorkflowEditor"));

const QualityRoutes = () => {
  return (
    <Routes>
      <Route path="/workflow" element={<WorkflowEditor />} />
    </Routes>
  );
};

export default QualityRoutes;