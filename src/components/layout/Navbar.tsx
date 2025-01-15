import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import React, { useState } from "react";

export function Navbar() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Button variant="ghost" onClick={() => navigate("/quality/dashboard")}>Dashboard</Button>
      <Button variant="ghost" onClick={() => navigate("/quality/rnc")}>RNCs</Button>
      <Button variant="ghost" onClick={() => navigate("/admin/users")}>Administração</Button>
    </>
  );

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
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              <NavLinks />
            </div>
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
                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    <NavLinks />
                  </div>
                </SheetContent>
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