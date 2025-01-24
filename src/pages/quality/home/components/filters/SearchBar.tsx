import * as React from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isSearchExpanded: boolean;
  setIsSearchExpanded: (value: boolean) => void;
}

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  isSearchExpanded,
  setIsSearchExpanded,
}: SearchBarProps) => {
  return (
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
  );
};