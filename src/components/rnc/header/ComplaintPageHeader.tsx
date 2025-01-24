import React from "react";
import { Button } from "@/components/atoms/Button";

interface ComplaintPageHeaderProps {
  onCreateRNC: () => void;
}

export const ComplaintPageHeader = ({ onCreateRNC }: ComplaintPageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Minhas Reclamações
      </h2>
      <Button
        onClick={onCreateRNC}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Criar RNC
      </Button>
    </div>
  );
};