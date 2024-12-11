import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Brain, ClipboardCheck, Users, Truck } from "lucide-react";

export const SidebarNav = () => {
  const navItems = [
    {
      title: "Apps",
      href: "/apps",
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      title: "Intelligence",
      href: "/intelligence",
      icon: <Brain className="h-5 w-5" />,
    },
    {
      title: "Qualidade",
      href: "/quality",
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      title: "Administração",
      href: "/admin",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Portaria",
      href: "/portaria",
      icon: <Truck className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )
          }
        >
          {item.icon}
          <span className="ml-3">{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
};