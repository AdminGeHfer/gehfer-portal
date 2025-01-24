import { Button } from "@/components/ui/button";
import { RNCFilters } from "./components/RNCFilters";
import { RNCTable } from "./components/RNCTable";
import { useRNCs } from "@/hooks/useRNCs";
import { useState } from "react";
import { RNCStatus, RNCType, RNCDepartment } from "./types";

export const RNCHome = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<RNCStatus | null>(null);
  const [selectedType, setSelectedType] = useState<RNCType | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<RNCDepartment | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { filteredRNCs, isLoading, error } = useRNCs({
    selectedStatus,
    selectedType,
    selectedDepartment,
    searchTerm: searchQuery,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">RNCs</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe as RNCs do sistema
          </p>
        </div>

        <RNCFilters
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearchExpanded={isSearchExpanded}
          setIsSearchExpanded={setIsSearchExpanded}
          onCreateRNC={() => setIsCreateModalOpen(true)}
        />

        <div className="mt-6">
          <RNCTable data={filteredRNCs} />
        </div>
      </div>

      <footer className="fixed bottom-0 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex justify-center items-center bg-background/80 backdrop-blur-sm gap-3">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <a href="https://gehfer.com.br/" rel="noreferrer" target="_blank"> © 2025 GeHfer </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <a href="https://gehfer.com.br/" rel="noreferrer" target="_blank"> Sobre </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <a href="https://gehfer.com.br/" rel="noreferrer" target="_blank"> Ajuda </a>
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default RNCHome;