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

interface RNCFiltersProps {
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (value: string) => void;
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
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full md:w-[200px] bg-white dark:bg-gray-800">
            <SelectValue placeholder="Selecione um status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
            <SelectItem value="coletado">Coletado</SelectItem>
            <SelectItem value="solucionado">Solucionado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full md:w-[200px] bg-white dark:bg-gray-800">
            <SelectValue placeholder="Selecione um tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reclamacao">Reclamação do Cliente</SelectItem>
            <SelectItem value="fornecedor">Fornecedor</SelectItem>
            <SelectItem value="expedicao">Expedição</SelectItem>
            <SelectItem value="logistica">Logística</SelectItem>
            <SelectItem value="representante">Representante</SelectItem>
            <SelectItem value="motorista">Motorista</SelectItem>
            <SelectItem value="financeiro">Financeiro</SelectItem>
            <SelectItem value="comercial">Comercial</SelectItem>
            <SelectItem value="acordo">Acordo Financeiro</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-full md:w-[200px] bg-white dark:bg-gray-800">
            <SelectValue placeholder="Selecione um departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="logistica">Logística</SelectItem>
            <SelectItem value="qualidade">Qualidade</SelectItem>
            <SelectItem value="financeiro">Financeiro</SelectItem>
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