import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { RNCStats } from "@/components/dashboard/RNCStats";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export const DashboardHome = () => {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const { stats, loading, error } = useDashboardStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={signOut}
              className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-muted-foreground">
            Analise as métricas das RNCs geradas no portal
          </p>
        </div>

        <RNCStats stats={stats} isLoading={loading} error={error} />
      </div>

      
      <footer className="fixed bottom-0 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex justify-center items-center bg-background/80 backdrop-blur-sm gap-3">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <a href="https://gehfer.com.br/" rel="noreferrer" target="_blank"> © 2025 GeHfer </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <a href="https://gehfer.com.br/" rel="noreferrer" target="_blank"> Sobre </a>
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default DashboardHome;