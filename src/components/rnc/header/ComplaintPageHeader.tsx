import React from "react";
import { Button } from "@/components/atoms/Button";

interface ComplaintPageHeaderProps {
  onCreateRNC: () => void;
}

export const ComplaintPageHeader = ({ onCreateRNC }: ComplaintPageHeaderProps) => {
  return (
    <div className="flex justify-end items-center mb-6">
      <Button
        onClick={onCreateRNC}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Criar RNC
      </Button>
    </div>
  );
};