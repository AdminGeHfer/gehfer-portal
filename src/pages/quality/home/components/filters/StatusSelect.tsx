import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RNCStatus } from "../../types";

interface StatusSelectProps {
  selectedStatus: RNCStatus | null;
  setSelectedStatus: (value: RNCStatus | null) => void;
}

export const StatusSelect = ({ selectedStatus, setSelectedStatus }: StatusSelectProps) => {
  return (
    <Select 
      value={selectedStatus || ""} 
      onValueChange={(value) => setSelectedStatus(value as RNCStatus || null)}
    >
      <SelectTrigger className="w-full md:w-[200px] bg-white dark:bg-gray-800">
        <SelectValue placeholder="Selecione um status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Pendente">Pendente</SelectItem>
        <SelectItem value="Cancelado">Cancelado</SelectItem>
        <SelectItem value="Coletado">Coletado</SelectItem>
        <SelectItem value="Solucionado">Solucionado</SelectItem>
      </SelectContent>
    </Select>
  );
};