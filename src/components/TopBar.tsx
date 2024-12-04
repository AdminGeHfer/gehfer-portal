import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();
  const userName = "João Silva"; // Será dinâmico posteriormente

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex flex-1 items-center gap-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            The Four
          </span>
          <p className="text-muted-foreground">
            Bem-vindo, <span className="font-medium text-foreground">{userName}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt={userName} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;