import React from "react";
import { CreateRNCModal } from "@/components/rnc/CreateRNCModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const RNCHome = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de RNCs</h1>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Criar RNC
        </Button>
      </div>

      <CreateRNCModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default RNCHome;