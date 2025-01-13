import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { LoginCard } from "../components/LoginCard";

const Login = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/apps");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 backdrop-blur-sm bg-white/50 dark:bg-background/50 z-50"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>

      <LoginCard />
    </div>
  );
};

export default Login;