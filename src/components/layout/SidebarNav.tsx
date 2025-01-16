import { useState } from "react";
import * as React from "react";
import { NavItem } from "./nav/NavItem";
import { navItems } from "./nav/navItems";

export const SidebarNav = () => {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const toggleModule = (moduleTitle: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleTitle) 
        ? prev.filter(title => title !== moduleTitle)
        : [...prev, moduleTitle]
    );
  };

  return (
    <nav className="space-y-1 px-2">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          {...item}
          isExpanded={expandedModules.includes(item.title)}
          onToggle={() => toggleModule(item.title)}
        />
      ))}
    </nav>
  );
};