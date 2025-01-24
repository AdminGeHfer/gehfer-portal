import React from "react";
import { Button } from "@/components/ui/button";

interface ComplaintPageHeaderProps {
  onCreateRNC: () => void;
}

export const ComplaintPageHeader = ({ onCreateRNC }: ComplaintPageHeaderProps) => {
  const handleClick = () => {
    console.log("Create RNC button clicked");
    onCreateRNC();
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Minhas Reclamações
      </h2>
      <Button
        onClick={handleClick}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Criar RNC
      </Button>
    </div>
  );
};