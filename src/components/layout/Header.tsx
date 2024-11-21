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
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {title === "Portal GeHfer" ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="text-lg font-semibold">G</span>
              </div>
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>
          ) : (
            <h1 className="text-xl font-semibold">{title}</h1>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Bem-vindo, {userName}</span>
          <span className="text-sm text-muted-foreground">{email}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground">
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