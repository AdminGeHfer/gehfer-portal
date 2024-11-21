import { Moon, Sun, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface HeaderProps {
  title?: string;
  email?: string;
  userName?: string;
}

export function Header({ title = "Portal GeHfer", email = "john@example.com", userName = "John Doe" }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {title === "Portal GeHfer" ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700">
                <span className="text-lg font-semibold dark:text-white">G</span>
              </div>
              <h1 className="text-xl font-semibold dark:text-white">{title}</h1>
            </div>
          ) : (
            <h1 className="text-xl font-semibold dark:text-white">{title}</h1>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">Bem-vindo, {userName}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{email}</span>
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
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}