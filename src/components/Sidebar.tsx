import { Home, Users, Calendar, PieChart, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";
import React from "react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/app" },
    { icon: Users, label: "Clientes", path: "/app/clientes" },
    { icon: Calendar, label: "Agendamentos", path: "/app/agendamentos" },
    { icon: PieChart, label: "Relatórios", path: "/app/relatorios" },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path || 
           (path === "/app" && location.pathname === "/");
  };

  return (
    <div className="h-screen w-64 bg-background border-r border-border flex flex-col">
      <div className="p-6">
        <Logo />
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex items-center gap-3 w-full p-3 text-secondary-foreground rounded-lg transition-colors",
              isActiveRoute(item.path)
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 w-full p-3 text-secondary-foreground hover:bg-accent rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;