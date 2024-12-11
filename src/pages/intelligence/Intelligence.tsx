import { Routes, Route, Navigate } from "react-router-dom";
import Hub from "./Hub";
import IntelligenceRoutes from "@/routes/IntelligenceRoutes";

const Intelligence = () => {
  return (
    <Routes>
      <Route path="/" element={<Hub />} />
      <Route path="/chat/*" element={<IntelligenceRoutes />} />
      <Route path="*" element={<Navigate to="/intelligence" replace />} />
    </Routes>
  );
};

export default Intelligence;