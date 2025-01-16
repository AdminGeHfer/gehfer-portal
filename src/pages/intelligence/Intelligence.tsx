import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import * as React from "react";

const Intelligence = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="GeHfer Intelligence" 
        subtitle="Módulo de Inteligência Artificial" 
      />
      <Outlet />
    </div>
  );
};

export default Intelligence;