import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusSelect } from "./filters/StatusSelect";
import { TypeSelect } from "./filters/TypeSelect";
import { DepartmentSelect } from "./filters/DepartmentSelect";
import { SearchBar } from "./filters/SearchBar";
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
    <div className="flex flex-col gap-4 mb-6">
      {/* First line - Status and Type */}
      <div className="grid grid-cols-2 md:flex md:gap-2 gap-4">
        <StatusSelect
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
        <TypeSelect
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
      </div>

      {/* Second line - Department */}
      <div className="w-full">
        <DepartmentSelect
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
        />
      </div>

      {/* Third line - Search and Create Button */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchExpanded={isSearchExpanded}
            setIsSearchExpanded={setIsSearchExpanded}
          />
        </div>
        <Button 
          onClick={onCreateRNC}
          className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
        >
          Criar RNC
        </Button>
      </div>
    </div>
  );
};