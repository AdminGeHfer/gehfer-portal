import { Brain, Home, Users, FileText, Settings, Building2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/SidebarContext";

export function SidebarNav() {
  const { isCollapsed } = useSidebar();

  const routes = [
    {
      label: "Apps",
      icon: Home,
      href: "/apps",
      color: "text-sky-500",
    },
    {
      label: "Intelligence",
      icon: Brain,
      href: "/intelligence/hub",
      color: "text-violet-500",
    },
    {
      label: "Qualidade",
      icon: FileText,
      href: "/quality",
      color: "text-pink-700",
    },
    {
      label: "Portaria",
      icon: Building2,
      href: "/portaria",
      color: "text-orange-700",
    },
    {
      label: "Admin",
      icon: Settings,
      href: "/admin",
      color: "text-emerald-500",
    },
  ];

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {routes.map((route, index) => (
          <NavLink
            key={route.href}
            to={route.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                isActive ? "bg-accent" : "transparent",
                isCollapsed ? "justify-center" : ""
              )
            }
          >
            <route.icon className={cn("h-4 w-4", route.color)} />
            {!isCollapsed && <span>{route.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}