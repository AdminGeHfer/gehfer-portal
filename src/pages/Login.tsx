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
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0A192F]">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#112240] via-[#0A192F] to-[#233554] animate-gradient opacity-80" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 animate-pulse" />
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
      
      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#233554]/30 to-transparent rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [360, 270, 180, 90, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-[#112240]/30 to-transparent rounded-full blur-3xl"
        />
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
        <Card className="backdrop-blur-md bg-background/80 border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <motion.div 
                initial={{ scale: 0.8, rotateY: 0 }}
                animate={{ 
                  scale: 1,
                  rotateY: 360,
                }}
                transition={{ 
                  duration: 1.5,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#233554] to-[#112240] shadow-lg"
              >
                <span className="text-3xl font-bold text-primary-foreground">G</span>
              </motion.div>
            </div>
            <CardTitle className="text-3xl text-center font-bold">
              <motion.span
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Portal GeHfer
              </motion.span>
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground/80">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Entre com suas credenciais para acessar o sistema
              </motion.span>
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
                      brand: '#233554',
                      brandAccent: '#112240',
                      inputBackground: theme === 'dark' ? 'hsl(var(--background))' : 'white',
                      inputText: theme === 'dark' ? 'hsl(var(--foreground))' : 'black',
                      inputBorder: theme === 'dark' ? 'hsl(var(--border))' : '#e5e7eb',
                      inputBorderHover: theme === 'dark' ? 'hsl(var(--border))' : '#d1d5db',
                      inputBorderFocus: '#233554',
                    },
                  },
                },
                className: {
                  container: 'space-y-4',
                  button: 'w-full font-sans bg-gradient-to-r from-[#233554] to-[#112240] hover:from-[#112240] hover:to-[#233554] text-primary-foreground dark:text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
                  input: 'font-sans backdrop-blur-sm bg-background/50 border-border/50 focus:border-[#233554] transition-all duration-300',
                  label: 'font-sans',
                  anchor: 'font-sans text-[#233554] hover:text-[#112240]',
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