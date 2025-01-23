import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// const RNCList = lazy(() => import("@/pages/quality/RNCList"));
// const RNCDetail = lazy(() => import("@/pages/quality/RNCDetail"));
// const Dashboard = lazy(() => import("@/pages/quality/Dashboard"));
const WorkflowEditor = lazy(() => import("@/pages/quality/workflow/WorkflowEditor"));

const QualityRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/quality/dashboard" replace />} /> */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      {/* <Route path="/rnc" element={<RNCList />} /> */}
      {/* <Route path="/rnc/:id" element={<RNCDetail />} /> */}
      <Route path="/workflow" element={<WorkflowEditor />} />
    </Routes>
  );
};

export default QualityRoutes;