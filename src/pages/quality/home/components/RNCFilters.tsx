import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { RNCStatus, RNCType, RNCDepartment } from "../types";

interface RNCFiltersProps {
  selectedStatus: RNCStatus | null;
  setSelectedStatus: (value: RNCStatus | null) => void;
  selectedType: RNCType | null;
  setSelectedType: (value: RNCType | null) => void;
  selectedDepartment: RNCDepartment | null;
  setSelectedDepartment: (value: RNCDepartment | null) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isSearchExpanded: boolean;
  setIsSearchExpanded: (value: boolean) => void;
}

export const RNCFilters = ({
  selectedStatus,
  setSelectedStatus,
  selectedType,
  setSelectedType,
  selectedDepartment,
  setSelectedDepartment,
  searchQuery,
  setSearchQuery,
  isSearchExpanded,
  setIsSearchExpanded,
}: RNCFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 flex gap-4">
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

        <Select 
          value={selectedType || ""} 
          onValueChange={(value) => setSelectedType(value as RNCType || null)}
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
      </div>

      <div className="flex items-center gap-2">
        <div
          className={cn(
            "transition-all duration-300 flex items-center gap-2",
            isSearchExpanded ? "w-full md:w-[400px]" : "w-10"
          )}
        >
          {isSearchExpanded ? (
            <>
              <Input
                type="text"
                placeholder="Pesquise uma RNC (Número, Empresa, ...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-gray-800"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsSearchExpanded(false);
                  setSearchQuery("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchExpanded(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          + Nova RNC
        </Button>
      </div>
    </div>
  );
};