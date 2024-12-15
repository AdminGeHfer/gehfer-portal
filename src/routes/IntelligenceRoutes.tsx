import { Route, Routes } from "react-router-dom";
import { AgentTrainingHub } from "@/components/intelligence/training/AgentTrainingHub";
import { AgentTrainingSession } from "@/components/intelligence/training/AgentTrainingSession";
import { SomeExistingComponent } from "@/components/somewhere/SomeExistingComponent"; // Example existing import

export const IntelligenceRoutes = () => {
  return (
    <Routes>
      <Route path="/existing-route" element={<SomeExistingComponent />} />
      <Route path="/training" element={<AgentTrainingHub />} />
      <Route path="/training/:agentId" element={<AgentTrainingSession />} />
    </Routes>
  );
};
