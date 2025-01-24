import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RNCDepartment } from "../../types";

interface DepartmentSelectProps {
  selectedDepartment: RNCDepartment | null;
  setSelectedDepartment: (value: RNCDepartment | null) => void;
}

export const DepartmentSelect = ({ selectedDepartment, setSelectedDepartment }: DepartmentSelectProps) => {
  return (
    <Select 
      value={selectedDepartment || ""} 
      onValueChange={(value) => setSelectedDepartment(value as RNCDepartment || null)}
    >
      <SelectTrigger className="w-full md:w-[220px] bg-white dark:bg-gray-800">
        <SelectValue placeholder="Selecione um departamento" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Logística">Logística</SelectItem>
        <SelectItem value="Qualidade">Qualidade</SelectItem>
        <SelectItem value="Financeiro">Financeiro</SelectItem>
      </SelectContent>
    </Select>
  );
};