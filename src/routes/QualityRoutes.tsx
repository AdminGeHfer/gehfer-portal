import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const RNCList = lazy(() => import("@/components/modules/quality/pages/RNCList"));
const RNCDetail = lazy(() => import("@/components/modules/quality/pages/RNCDetail"));
const Dashboard = lazy(() => import("@/components/modules/quality/pages/Dashboard"));
const WorkflowEditor = lazy(() => import("@/components/modules/quality/pages/workflow/WorkflowEditor"));

const QualityRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quality/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/rnc" element={<RNCList />} />
      <Route path="/rnc/:id" element={<RNCDetail />} />
      <Route path="/workflow" element={<WorkflowEditor />} />
    </Routes>
  );
};

export default QualityRoutes;