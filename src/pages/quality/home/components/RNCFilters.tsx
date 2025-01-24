import * as React from 'react';
import { Button } from "@/components/ui/button";
import { RNCStatus, RNCType, RNCDepartment } from "../types";
import { StatusSelect } from "./filters/StatusSelect";
import { TypeSelect } from "./filters/TypeSelect";
import { DepartmentSelect } from "./filters/DepartmentSelect";
import { SearchBar } from "./filters/SearchBar";

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

      <div className="flex items-center gap-2">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearchExpanded={isSearchExpanded}
          setIsSearchExpanded={setIsSearchExpanded}
        />
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Criar RNC
        </Button>
      </div>
    </div>
  );
};