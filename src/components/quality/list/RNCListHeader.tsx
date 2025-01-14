import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RNCForm } from "@/components/quality/RNCForm";
import { useState } from "react";

interface RNCListHeaderProps {
  onRNCCreated: () => void;
}

export const RNCListHeader = ({ onRNCCreated }: RNCListHeaderProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsFormOpen(false);
      onRNCCreated();
      return "success";
    } catch (error) {
      console.error("Error creating RNC:", error);
      throw error;
    }
  };

  return (
    <div className="mb-8 flex justify-between items-center px-1">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Registro de Não Conformidade (RNC)</h1>
        <p className="text-muted-foreground">Gerencie todas as não conformidades registradas</p>
      </div>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#4318FF] hover:bg-[#3311DD] text-white font-medium ml-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nova RNC
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <RNCForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  );
}