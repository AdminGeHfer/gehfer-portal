import React from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/SidebarContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({ children, className }: SidebarProps) {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-20 h-screen border-r bg-card transition-all duration-300 lg:relative",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-30 hidden h-6 w-6 rounded-full border bg-background lg:flex"
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted">
        {children}
      </div>
    </aside>
  );
}