import * as React from "react";
import { 
  Home,
  ClipboardCheck,
  Network,
  ClipboardPen,
  FileChartColumnIncreasing,
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
    title: "Qualidade",
    href: "/quality",
    icon: <ClipboardCheck className="h-5 w-5" />,
    subModules: [
      {
        title: "RNCs",
        href: "/quality/home",
        icon: <ClipboardPen className="h-4 w-4" />,
      },
      {
        title: "Dashboard",
        href: "/quality/dashboard",
        icon: <FileChartColumnIncreasing className="h-4 w-4" />
      },
      {
        title: "Fluxo de Notificações",
        href: "/quality/workflow",
        icon: <Network className="h-4 w-4" />,
      },
    ],
  },
];