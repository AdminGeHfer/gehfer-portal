import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RNCForm } from "@/components/quality/RNCForm";
import { useState } from "react";
import { RNCFormData } from "@/types/rnc";

interface RNCListHeaderProps {
  onRNCCreated: () => void;
}

export const RNCListHeader = ({ onRNCCreated }: RNCListHeaderProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = async (data: RNCFormData) => {
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
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Registro de Não Conformidade (RNC)</h1>
        <p className="text-muted-foreground">Gerencie todas as não conformidades registradas</p>
      </div>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#4318FF] hover:bg-[#3311DD] text-white font-medium">
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
};