import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Users, LineChart, KanbanSquare } from "lucide-react";

const CRMLayout = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <aside className="w-64 bg-card border-r">
        <nav className="p-4 space-y-2">
          <NavLink
            to="/app/crm/funnel"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent text-muted-foreground"
              }`
            }
          >
            <KanbanSquare className="h-5 w-5" />
            <span>Funil de Vendas</span>
          </NavLink>
          <NavLink
            to="/app/crm/customers"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent text-muted-foreground"
              }`
            }
          >
            <Users className="h-5 w-5" />
            <span>Clientes</span>
          </NavLink>
          <NavLink
            to="/app/crm/reports"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent text-muted-foreground"
              }`
            }
          >
            <LineChart className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default CRMLayout;