import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { usePortariaTrucks } from "@/hooks/usePortariaTrucks";
import { useState } from "react";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { VehicleFields } from "./VehicleFields";
import { OperationFields } from "./OperationFields";

interface RegisterTruckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegisterTruckDialog({ open, onOpenChange }: RegisterTruckDialogProps) {
  const { createTruck } = usePortariaTrucks();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("vehicle");
  const [initialKmPhoto, setInitialKmPhoto] = useState<File | null>(null);
  const [finalKmPhoto, setFinalKmPhoto] = useState<File | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      plate: "",
      driver_name: "",
      truck_type: "",
      transport_company: "",
      operation_type: "loading",
      notes: "",
      initialKm: "",
      finalKm: "",
    },
  });

  const operationType = watch("operation_type");
  const showMileageFields = operationType === "loading" || operationType === "both";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'initial' | 'final') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'initial') {
        setInitialKmPhoto(file);
      } else {
        setFinalKmPhoto(file);
      }
    }
  };

  const onSubmit = async (data) => {
    if (activeTab === "vehicle") {
      setActiveTab("operation");
      return;
    }

    setIsLoading(true);
    try {
      await createTruck.mutateAsync({
        ...data,
        initialKm: data.initialKm ? parseFloat(data.initialKm) : undefined,
        finalKm: data.finalKm ? parseFloat(data.finalKm) : undefined,
        initialKmPhoto,
        finalKmPhoto,
      });
      reset();
      onOpenChange(false);
      toast.success("Caminhão registrado com sucesso!");
    } catch {
      toast.error("Erro ao registrar caminhão");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar Entrada de Caminhão</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vehicle">Veículo</TabsTrigger>
            <TabsTrigger value="operation">Operação</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <TabsContent value="vehicle">
              <VehicleFields register={register} setValue={setValue} watch={watch} />
            </TabsContent>

            <TabsContent value="operation">
              <OperationFields 
                register={register} 
                setValue={setValue} 
                watch={watch}
                showMileageFields={showMileageFields}
                initialKmPhoto={initialKmPhoto}
                finalKmPhoto={finalKmPhoto}
                onInitialPhotoChange={(e) => handleFileChange(e, 'initial')}
                onFinalPhotoChange={(e) => handleFileChange(e, 'final')}
                onInitialPhotoRemove={() => setInitialKmPhoto(null)}
                onFinalPhotoRemove={() => setFinalKmPhoto(null)}
              />
            </TabsContent>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {activeTab === "vehicle" ? "Avançar" : isLoading ? "Registrando..." : "Registrar Entrada"}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}