import React from "react";
import { 
  Home,
  ClipboardCheck,
  LayoutDashboard,
  FileText,
  Network,
  Users,
  Truck,
  Package,
  Brain,
  MessageSquare,
  Settings,
  Building2,
} from "lucide-react";

export interface SubModule {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  subModules?: SubModule[];
}

export const navItems: NavItem[] = [
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
        title: "Chat",
        href: "/intelligence/chat",
        icon: <MessageSquare className="h-4 w-4" />,
      },
      {
        title: "Setores",
        href: "/intelligence/sectors",
        icon: <Building2 className="h-4 w-4" />,
      },
      {
        title: "Configurações",
        href: "/intelligence/settings",
        icon: <Settings className="h-4 w-4" />,
      },
      {
        title: "Docling POC",
        href: "/intelligence/docling-poc",
        icon: <FileText className="h-4 w-4" />,
      }
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