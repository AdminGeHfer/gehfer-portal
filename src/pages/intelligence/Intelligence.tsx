import { Header } from "@/components/layout/Header";
import IntelligenceRoutes from "@/routes/IntelligenceRoutes";

const Intelligence = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="GeHfer Intelligence" 
        subtitle="Central de Inteligência Artificial" 
      />
      <IntelligenceRoutes />
    </div>
  );
};

export default Intelligence;