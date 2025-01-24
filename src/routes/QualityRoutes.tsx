import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const WorkflowEditor = lazy(() => import("@/pages/quality/workflow/WorkflowEditor"));
const RNCHome = lazy(() => import("@/pages/quality/home/RNCHome"));

const QualityRoutes = () => {
  return (
    <Routes>
      <Route path="/workflow" element={<WorkflowEditor />} />
      <Route path="/home" element={<RNCHome />} />
      <Route index element={<RNCHome />} />
    </Routes>
  );
};

export default QualityRoutes;