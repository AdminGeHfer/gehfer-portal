import * as React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

interface SubModule {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface NavItemProps {
  title: string;
  href: string;
  icon: React.ReactNode;
  subModules?: SubModule[];
  isExpanded: boolean;
  onToggle: () => void;
}

export const NavItem = ({ 
  title, 
  href, 
  icon, 
  subModules, 
  isExpanded, 
  onToggle 
}: NavItemProps) => {
  const { isCollapsed } = useSidebar();
  const hasSubModules = subModules && subModules.length > 0;

  return (
    <div className="space-y-1">
      <NavLink
        to={hasSubModules ? "#" : href}
        onClick={hasSubModules ? onToggle : undefined}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors relative",
            "hover:bg-accent hover:text-accent-foreground",
            isActive
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground",
            isCollapsed && "justify-center"
          )
        }
      >
        {icon}
        {!isCollapsed && (
          <>
            <span className="flex-1">{title}</span>
            {hasSubModules && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "transform rotate-180"
                )}
              />
            )}
          </>
        )}
      </NavLink>

      {hasSubModules && isExpanded && !isCollapsed && (
        <div className="ml-4 space-y-1">
          {subModules.map((subModule) => (
            <NavLink
              key={subModule.href}
              to={subModule.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-x-3 rounded-md px-3 py-2 text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )
              }
            >
              {subModule.icon}
              <span>{subModule.title}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};