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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background" />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </motion.div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4"
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
        className="w-full max-w-md"
      >
        <Card className="border-2 backdrop-blur-sm bg-background/80">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary"
              >
                <span className="text-2xl font-bold text-primary-foreground">G</span>
              </motion.div>
            </div>
            <CardTitle className="text-2xl text-center">Portal GeHfer</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  button: 'w-full font-sans bg-primary hover:bg-primary/90 text-primary-foreground dark:text-primary-foreground',
                  input: 'font-sans',
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