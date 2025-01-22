import * as React from "react";
import { 
  Home,
  ClipboardCheck,
  Network,
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
        title: "Workflow",
        href: "/quality/workflow",
        icon: <Network className="h-4 w-4" />,
      },
    ],
  },
];