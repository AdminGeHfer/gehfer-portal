import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ComplaintFiltersProps {
  filters: {
    protocol: string;
    date: string;
    company: string;
    status: string;
    daysOpen: string;
  };
  onFilterChange: (field: string, value: string) => void;
}

export const ComplaintFilters = ({
  filters,
  onFilterChange,
}: ComplaintFiltersProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="protocol">Protocolo</Label>
          <Input
            id="protocol"
            value={filters.protocol}
            onChange={(e) => onFilterChange("protocol", e.target.value)}
            placeholder="Buscar por protocolo..."
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            value={filters.date}
            onChange={(e) => onFilterChange("date", e.target.value)}
            placeholder="Buscar por data..."
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="company">Empresa</Label>
          <Input
            id="company"
            value={filters.company}
            onChange={(e) => onFilterChange("company", e.target.value)}
            placeholder="Buscar por empresa..."
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange("status", value)}
          >
            <SelectTrigger id="status" className="mt-1">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="resolved">Resolvido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="daysOpen">Dias em Aberto</Label>
          <Select
            value={filters.daysOpen}
            onValueChange={(value) => onFilterChange("daysOpen", value)}
          >
            <SelectTrigger id="daysOpen" className="mt-1">
              <SelectValue placeholder="Filtrar por dias em aberto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-7">0-7 dias</SelectItem>
              <SelectItem value="8-15">8-15 dias</SelectItem>
              <SelectItem value="15+">15+ dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};