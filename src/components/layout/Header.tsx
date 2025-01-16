import * as React from "react";
import { useTheme } from "next-themes";
import { LogOut, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch {
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div>
          <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}