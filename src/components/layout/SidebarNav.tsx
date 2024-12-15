import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home,
  ClipboardCheck,
  LayoutDashboard,
  FileText,
  Network,
  Users,
  Truck,
  Package,
  ChevronDown,
  Brain,
  MessageSquare,
  Settings,
  Building2,
  GraduationCap
} from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useState } from "react";

interface SubModule {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  subModules?: SubModule[];
}

export const SidebarNav = () => {
  const { isCollapsed } = useSidebar();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const toggleModule = (moduleTitle: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleTitle) 
        ? prev.filter(title => title !== moduleTitle)
        : [...prev, moduleTitle]
    );
  };

  const navItems: NavItem[] = [
    {
      title: "Home",
      href: "/apps",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "GeHfer Intelligence",
      href: "/intelligence",
      icon: <Brain className="h-5 w-5" />,
      subModules: [
        {
          title: "Hub IA",
          href: "/intelligence/hub",
          icon: <Brain className="h-4 w-4" />,
        },
        {
          title: "Setores",
          href: "/intelligence/sectors",
          icon: <Building2 className="h-4 w-4" />,
        },
        {
          title: "Chat",
          href: "/intelligence/chat",
          icon: <MessageSquare className="h-4 w-4" />,
        },
        {
          title: "Treinamento",
          href: "/intelligence/training",
          icon: <GraduationCap className="h-4 w-4" />,
        },
        {
          title: "Configurações",
          href: "/intelligence/settings",
          icon: <Settings className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Qualidade",
      href: "/quality",
      icon: <ClipboardCheck className="h-5 w-5" />,
      subModules: [
        {
          title: "Dashboard",
          href: "/quality/dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          title: "RNCs",
          href: "/quality/rnc",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "Workflow",
          href: "/quality/workflow",
          icon: <Network className="h-4 w-4" />,
        },
      ],
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
    {
      title: "Cadastros",
      href: "/cadastros",
      icon: <Package className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="space-y-1 px-2">
      {navItems.map((item) => {
        const isExpanded = expandedModules.includes(item.title);
        const hasSubModules = item.subModules && item.subModules.length > 0;

        return (
          <div key={item.href} className="space-y-1">
            <NavLink
              to={hasSubModules ? "#" : item.href}
              onClick={hasSubModules ? () => toggleModule(item.title) : undefined}
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
              {item.icon}
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
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
                {item.subModules.map((subModule) => (
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
      })}
    </nav>
  );
};