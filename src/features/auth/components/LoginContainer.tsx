import { LoginForm } from "./LoginForm";
import { LoginBackground } from "./LoginBackground";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const LoginContainer = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <LoginBackground />
      
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

      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-md bg-white/90 dark:bg-background/80 border border-gray-200/50 dark:border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-blue-400 dark:to-blue-600">
                Portal GeHfer
              </span>
            </h1>
            <p className="text-gray-600 dark:text-muted-foreground/80">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};