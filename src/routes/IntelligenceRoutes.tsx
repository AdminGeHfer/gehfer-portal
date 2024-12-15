import { Route, Routes } from "react-router-dom";
import { AgentTrainingHub } from "@/components/intelligence/training/AgentTrainingHub";
import { AgentTrainingSession } from "@/components/intelligence/training/AgentTrainingSession";

const IntelligenceRoutes = () => {
  return (
    <Routes>
      <Route path="/training" element={<AgentTrainingHub />} />
      <Route path="/training/:agentId" element={<AgentTrainingSession />} />
    </Routes>
  );
};

export default IntelligenceRoutes;