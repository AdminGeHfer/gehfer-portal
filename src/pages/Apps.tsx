import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import * as React from "react";

const modules = [
  {
    title: "Qualidade",
    description: "Gestão de qualidade e controle de processos",
    icon: <ClipboardCheck className="h-12 w-12 text-primary" />,
    route: "/quality/home",
    submodules: [
      { title: "RNCs", route: "/quality/home", icon: <ClipboardCheck className="h-4 w-4" /> }
    ]
  }
];

const Apps = () => {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch {
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-2xl font-semibold tracking-tight">Portal GeHfer</h1>
          <div className="flex items-center gap-4">
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

      <main className="px-6 py-8">
        <div className="max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Selecione um módulo para começar</h2>
            <p className="text-muted-foreground">
              Acesse as ferramentas e recursos disponíveis
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className=''>
                <Card 
                  className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/20 backdrop-blur-sm bg-card/50 border-primary/20"
                  onClick={() => navigate(module.route)}>
                  <div className="bg-primary/5 p-8 flex justify-center items-center group-hover:bg-primary/10 transition-colors">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}>
                      {module.icon}
                    </motion.div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                      {module.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{module.description}</p>
                    <Button
                      variant="ghost"
                      className="w-full justify-start group-hover:text-primary transition-colors">
                      Acessar módulo
                      <motion.span
                        className="ml-2"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}>
                      </motion.span>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

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

// Make sure to export the component as default
export default Apps;