import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { usePortariaTrucks } from "@/hooks/usePortariaTrucks";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

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

  const onSubmit = async (data: any) => {
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
    } catch (error) {
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
            <TabsContent value="vehicle" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plate">Placa</Label>
                  <Input
                    id="plate"
                    placeholder="ABC1234"
                    {...register("plate", { required: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driver_name">Nome do Motorista</Label>
                  <Input
                    id="driver_name"
                    placeholder="Nome completo"
                    {...register("driver_name", { required: true })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="truck_type">Tipo de Veículo</Label>
                  <Select
                    onValueChange={(value) => setValue("truck_type", value)}
                    defaultValue={watch("truck_type")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="Carreta">Carreta</SelectItem>
                      <SelectItem value="Bitrem">Bitrem</SelectItem>
                      <SelectItem value="Rodotrem">Rodotrem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transport_company">Transportadora</Label>
                  <Input
                    id="transport_company"
                    placeholder="Nome da transportadora"
                    {...register("transport_company", { required: true })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="operation" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="operation_type">Tipo de Operação</Label>
                  <Select
                    onValueChange={(value) => setValue("operation_type", value)}
                    defaultValue={watch("operation_type")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de operação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loading">Carga</SelectItem>
                      <SelectItem value="unloading">Descarga</SelectItem>
                      <SelectItem value="both">Carga/Descarga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initialKm">Quilometragem Inicial</Label>
                  <Input
                    id="initialKm"
                    type="number"
                    placeholder="KM atual do veículo"
                    {...register("initialKm")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="finalKm">Quilometragem Final</Label>
                  <Input
                    id="finalKm"
                    type="number"
                    placeholder="KM final do veículo"
                    {...register("finalKm")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Foto KM Inicial</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'initial')}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Foto KM Final</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'final')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  placeholder="Observações adicionais"
                  {...register("notes")}
                />
              </div>
            </TabsContent>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              {activeTab !== "operation" ? (
                <Button
                  type="button"
                  onClick={() => setActiveTab("operation")}
                >
                  Avançar
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? "Registrando..." : "Registrar Entrada"}
                </Button>
              )}
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}