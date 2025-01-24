import * as React from 'react';
import { RNCStatus, RNCType, RNCDepartment } from "../types";
import { StatusSelect } from "./filters/StatusSelect";
import { TypeSelect } from "./filters/TypeSelect";
import { DepartmentSelect } from "./filters/DepartmentSelect";
import { SearchBar } from "./filters/SearchBar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
  onCreateRNC: () => void;
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
  onCreateRNC,
}: RNCFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 flex gap-4">
        <StatusSelect
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
        <TypeSelect
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
        <DepartmentSelect
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
        />
      </div>

      <div className="flex items-center gap-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearchExpanded={isSearchExpanded}
          setIsSearchExpanded={setIsSearchExpanded}
        />
        <Button 
          onClick={onCreateRNC}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Criar RNC
        </Button>
      </div>
    </div>
  );
};