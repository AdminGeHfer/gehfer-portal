import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NotificationsPopover } from "../notifications/NotificationsPopover";
import { ProfileUpload } from "../profile/ProfileUpload";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Portal GeHfer" }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      return {
        name: profile?.name || 'Usuário',
      };
    },
  });

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          {title === "Portal GeHfer" ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="text-lg font-semibold">G</span>
              </div>
              <h1 className="text-xl font-semibold hidden sm:block">{title}</h1>
            </div>
          ) : (
            <h1 className="text-xl font-semibold truncate">{title}</h1>
          )}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-sm text-muted-foreground hidden sm:block">
            Bem-vindo, {user?.name}
          </span>
          
          <NotificationsPopover />
          
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
            <span className="sr-only">Alternar tema</span>
          </Button>

          <ProfileUpload />
        </div>
      </div>
    </header>
  );
}