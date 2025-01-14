import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehicleFieldsProps {
  register;
  setValue;
  watch;
}

export function VehicleFields({ register, setValue, watch }: VehicleFieldsProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}