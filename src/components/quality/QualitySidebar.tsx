import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ClipboardList, 
  Calendar,
  Settings,
  Truck
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Coletas Agendadas",
    icon: Calendar,
    path: "/quality/collections"
  },
  {
    title: "Workflow",
    icon: ClipboardList,
    path: "/quality/workflow"
  },
  {
    title: "Transportadoras",
    icon: Truck,
    path: "/quality/carriers"
  },
  {
    title: "Configurações",
    icon: Settings,
    path: "/quality/settings"
  }
];

export function QualitySidebar() {
  const location = useLocation();

  return (
    <div className="h-full w-full py-4">
      <nav className="space-y-2 px-2">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}