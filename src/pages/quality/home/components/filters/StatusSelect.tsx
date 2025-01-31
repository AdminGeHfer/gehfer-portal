import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RncStatusEnum } from "@/types/rnc";

interface StatusSelectProps {
  value: RncStatusEnum | null;
  onChange: (value: RncStatusEnum | null) => void;
}

export const StatusSelect = ({ value, onChange }: StatusSelectProps) => (
  <Select value={value || "all"} onValueChange={v => onChange(v === "all" ? null : v as RncStatusEnum)}>
    <SelectTrigger>
      <SelectValue placeholder="Status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Todos</SelectItem>
      {Object.values(RncStatusEnum).map(status => (
        <SelectItem key={status} value={status}>
          {status}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
