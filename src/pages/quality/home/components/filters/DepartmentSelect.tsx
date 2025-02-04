import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RncDepartmentEnum } from "@/types/rnc";

interface DepartmentSelectProps {
  selectedDepartment: RncDepartmentEnum | null;
  setSelectedDepartment: (value: RncDepartmentEnum | null) => void;
}

export const DepartmentSelect = ({ selectedDepartment, setSelectedDepartment }: DepartmentSelectProps) => {
  return (
    <Select 
      value={selectedDepartment || ""} 
      onValueChange={(value) => setSelectedDepartment(value as RncDepartmentEnum || null)}
    >
      <SelectTrigger className="w-full md:w-[220px] bg-white dark:bg-gray-800">
        <SelectValue placeholder="Selecione um departamento" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="logistics">Logística</SelectItem>
        <SelectItem value="quality">Qualidade</SelectItem>
        <SelectItem value="financial">Financeiro</SelectItem>
      </SelectContent>
    </Select>
  );
};