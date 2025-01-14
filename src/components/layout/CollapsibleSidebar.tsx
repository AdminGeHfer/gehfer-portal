import React from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarProps {
  children: React.ReactNode;
}

export function CollapsibleSidebar({ children }: SidebarProps) {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-40 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <nav className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted">
            {children}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "relative h-screen border-r bg-card transition-all duration-300 lg:block",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-30 hidden h-7 w-7 rounded-full border bg-background lg:flex"
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
      <nav className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted">
        {children}
      </nav>
    </aside>
  );
}