import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-accent/20 animate-gradient" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 animate-pulse" />
      
      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      {/* Theme toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 backdrop-blur-sm bg-background/50"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="backdrop-blur-md bg-background/80 border border-border/50 shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 260,
                  damping: 20 
                }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/90 shadow-lg"
              >
                <span className="text-3xl font-bold text-primary-foreground">G</span>
              </motion.div>
            </div>
            <CardTitle className="text-3xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Portal GeHfer
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground/80">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(var(--primary))',
                      brandAccent: 'hsl(var(--primary))',
                      inputBackground: theme === 'dark' ? 'hsl(var(--background))' : 'white',
                      inputText: theme === 'dark' ? 'hsl(var(--foreground))' : 'black',
                      inputBorder: theme === 'dark' ? 'hsl(var(--border))' : '#e5e7eb',
                      inputBorderHover: theme === 'dark' ? 'hsl(var(--border))' : '#d1d5db',
                      inputBorderFocus: 'hsl(var(--ring))',
                    },
                  },
                },
                className: {
                  container: 'space-y-4',
                  button: 'w-full font-sans bg-primary hover:bg-primary/90 text-primary-foreground dark:text-primary-foreground transition-all duration-200 shadow-md hover:shadow-lg',
                  input: 'font-sans backdrop-blur-sm bg-background/50 border-border/50',
                  label: 'font-sans',
                  anchor: 'font-sans text-primary hover:text-primary/80',
                },
              }}
              providers={[]}
              localization={{
                variables: {
                  sign_in: {
                    email_label: "Email",
                    password_label: "Senha",
                    button_label: "Entrar",
                    loading_button_label: "Entrando...",
                    email_input_placeholder: "seu@email.com",
                    password_input_placeholder: "Sua senha",
                  },
                  sign_up: {
                    email_label: "Email",
                    password_label: "Senha",
                    button_label: "Cadastrar",
                    loading_button_label: "Cadastrando...",
                    email_input_placeholder: "seu@email.com",
                    password_input_placeholder: "Sua senha",
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;