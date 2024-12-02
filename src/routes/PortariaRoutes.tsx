import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const AccessControl = lazy(() => import("@/pages/portaria/AccessControl"));
const PortariaList = lazy(() => import("@/pages/portaria/PortariaList"));

const PortariaRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/portaria/acesso" replace />} />
      <Route path="/acesso" element={<AccessControl />} />
      <Route path="/filas" element={<PortariaList />} />
    </Routes>
  );
};

export default PortariaRoutes;