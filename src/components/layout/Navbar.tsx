import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import * as React from "react";

export function Navbar() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 
              className="text-2xl font-heading font-bold text-primary hover:opacity-80 cursor-pointer" 
              onClick={() => navigate("/apps")}
            >
              GeHfer
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
            </div>

            <Button 
              variant="outline" 
              onClick={signOut}
              className="flex items-center gap-2 hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}