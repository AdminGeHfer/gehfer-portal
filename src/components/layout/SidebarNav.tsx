import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ClipboardCheck, 
  Users, 
  Truck, 
  Package, 
  GitBranch,
  Home,
  LayoutDashboard,
  Brain,
  MessageSquare,
  Settings,
  Building2
} from "lucide-react";

interface Module {
  title: string;
  icon: React.ElementType;
  path: string;
  submodules?: {
    title: string;
    path: string;
    icon: React.ElementType;
  }[];
}

const modules: Module[] = [
  {
    title: "Home",
    icon: Home,
    path: "/apps",
  },
  {
    title: "GeHfer Intelligence",
    icon: Brain,
    path: "/intelligence",
    submodules: [
      { title: "Hub IA", path: "/intelligence/hub", icon: Brain },
      { title: "Setores", path: "/intelligence/sectors", icon: Building2 },
      { title: "Chat", path: "/intelligence/chat", icon: MessageSquare },
      { title: "Configurações", path: "/intelligence/settings", icon: Settings }
    ]
  },
  {
    title: "Qualidade",
    icon: ClipboardCheck,
    path: "/quality/rnc",
    submodules: [
      { title: "Dashboard", path: "/quality/dashboard", icon: LayoutDashboard },
      { title: "RNCs", path: "/quality/rnc", icon: ClipboardCheck },
      { title: "Workflow", path: "/quality/workflow", icon: GitBranch }
    ]
  },
  {
    title: "Administração",
    icon: Users,
    path: "/admin/users"
  },
  {
    title: "Portaria",
    icon: Truck,
    path: "/portaria/acesso"
  },
  {
    title: "Cadastros",
    icon: Package,
    path: "/admin/products"
  }
];

export function SidebarNav() {
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="space-y-2 p-4">
      {modules.map((module) => (
        <div key={module.path} className="space-y-2">
          <Button
            variant={isActive(module.path) ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              isCollapsed && "justify-center px-2"
            )}
            onClick={() => navigate(module.path)}
          >
            <module.icon className={cn(
              "h-5 w-5",
              !isCollapsed && "mr-2"
            )} />
            {!isCollapsed && <span>{module.title}</span>}
          </Button>

          {!isCollapsed && module.submodules?.map((sub) => (
            <Button
              key={sub.path}
              variant={isActive(sub.path) ? "secondary" : "ghost"}
              className="w-full justify-start pl-8"
              onClick={() => navigate(sub.path)}
            >
              <sub.icon className="mr-2 h-4 w-4" />
              <span>{sub.title}</span>
            </Button>
          ))}
        </div>
      ))}
    </nav>
  );
}
