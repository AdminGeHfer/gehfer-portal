// src/pages/quality/home/RNCHome.tsx
import { Button } from "@/components/ui/button";
import { RNCFilters } from "./components/RNCFilters";
import { RNCTable } from "./components/RNCTable";
import { useRNCs } from "@/hooks/useRNCs";
import { useRNCList } from "@/hooks/useRNCList";
import { useState } from "react";
import { RncStatusEnum, RncTypeEnum, RncDepartmentEnum } from "@/types/rnc";
import { CreateRNCModal } from "@/components/rnc/CreateRNCModal";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import * as React from "react";

export const RNCHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<RncStatusEnum | null>(null);
  const [selectedType, setSelectedType] = useState<RncTypeEnum | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<RncDepartmentEnum | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();

  const { rncs, loading: isLoading, error, refetch } = useRNCList();

  const { filteredRNCs } = useRNCs({
    rncs,
    selectedStatus,
    selectedType,
    selectedDepartment,
    searchTerm: searchQuery,
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight">Registros de Não Conformidades (RNCs)</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={signOut}
              className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-muted-foreground">
            Gerencie e acompanhe as RNCs do portal
          </p>
        </div>

        <RNCFilters
          filters={{
            searchTerm: searchQuery,
            selectedStatus,
            selectedType,
            selectedDepartment
          }}
          onFilterChange={(key, value) => {
            switch (key) {
              case 'searchTerm':
                setSearchQuery(value);
                break;
              case 'selectedStatus':
                setSelectedStatus(value);
                break;
              case 'selectedType':
                setSelectedType(value);
                break;
              case 'selectedDepartment':
                setSelectedDepartment(value);
                break;
            }
          }}
          onCreateRNC={() => setIsCreateModalOpen(true)}
        />

        <div className="mt-6">
          <RNCTable 
            rncs={filteredRNCs}
            onEdit={() => {}} // Implement if needed
            onDelete={() => {}} // Implement if needed
            isLoading={isLoading}
          />
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

      <CreateRNCModal 
        open={isCreateModalOpen} 
        onClose={() => {
          setIsCreateModalOpen(false);
          refetch();
        }} 
      />
    </div>
  );
};

export default RNCHome;
