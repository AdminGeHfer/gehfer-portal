import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RncTypeEnum } from "@/types/rnc";


interface TypeSelectProps {
  selectedType: RncTypeEnum | null;
  setSelectedType: (value: RncTypeEnum | null) => void;
}

export const TypeSelect = ({ selectedType, setSelectedType }: TypeSelectProps) => {
  return (
    <Select 
      value={selectedType || ""} 
      onValueChange={(value) => setSelectedType(value as RncTypeEnum || null)}
    >
      <SelectTrigger className="w-full md:w-[200px] bg-white dark:bg-gray-800">
        <SelectValue placeholder="Selecione um tipo" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Reclamação do Cliente">Reclamação do Cliente</SelectItem>
        <SelectItem value="Fornecedor">Fornecedor</SelectItem>
        <SelectItem value="Expedição">Expedição</SelectItem>
        <SelectItem value="Logística">Logística</SelectItem>
        <SelectItem value="Representante">Representante</SelectItem>
        <SelectItem value="Motorista">Motorista</SelectItem>
        <SelectItem value="Financeiro">Financeiro</SelectItem>
        <SelectItem value="Comercial">Comercial</SelectItem>
        <SelectItem value="Acordo Financeiro">Acordo Financeiro</SelectItem>
      </SelectContent>
    </Select>
  );
};