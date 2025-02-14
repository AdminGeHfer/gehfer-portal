import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export const LoginCard = () => {
  const { theme } = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md relative z-10"
    >
      <div className="backdrop-blur-md bg-white/90 dark:bg-background/80 border border-gray-200/50 dark:border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center mb-4">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ 
              scale: 1,
              rotateY: [0, 180, 360],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 5
            }}
          >
            <img 
              src="/favicon-32x32.png"
              alt="GeHfer Logo"
              className="w-20 h-20 object-contain"  // Slightly smaller than the container for padding
            />
          </motion.div>
          </div>
          
          <h1 className="text-3xl text-center font-bold">
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-blue-400 dark:to-blue-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Portal GeHfer
            </motion.span>
          </h1>
          
          <p className="text-center text-gray-600 dark:text-muted-foreground/80">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Entre com suas credenciais para acessar o sistema
            </motion.span>
          </p>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: theme === 'dark' ? '#233554' : '#64748b',
                    brandAccent: theme === 'dark' ? '#112240' : '#475569',
                    inputBackground: theme === 'dark' ? 'hsl(var(--background))' : 'white',
                    inputText: theme === 'dark' ? 'hsl(var(--foreground))' : '#1e293b',
                    inputBorder: theme === 'dark' ? 'hsl(var(--border))' : '#e2e8f0',
                    inputBorderHover: theme === 'dark' ? 'hsl(var(--border))' : '#cbd5e1',
                    inputBorderFocus: theme === 'dark' ? '#233554' : '#64748b',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'w-full font-sans bg-gradient-to-r from-gray-600 to-gray-700 dark:from-[#233554] dark:to-[#112240] hover:from-gray-700 hover:to-gray-800 dark:hover:from-[#112240] dark:hover:to-[#233554] text-white dark:text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
                input: 'font-sans backdrop-blur-sm bg-white/50 dark:bg-background/50 border-gray-200/50 dark:border-border/50 focus:border-gray-400 dark:focus:border-[#233554] transition-all duration-300',
                label: 'font-sans text-gray-700 dark:text-gray-300',
                message: ({ isSuccess }: { isSuccess?: boolean }) => {
                  return isSuccess 
                    ? 'bg-success/10 dark:bg-success/20 text-success dark:text-success-foreground p-2 rounded-md border border-success/20 dark:border-success/30'
                    : 'bg-destructive/10 dark:bg-destructive/20 text-destructive dark:text-destructive-foreground p-2 rounded-md border border-destructive/20 dark:border-destructive/30'
                }
              },
            }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email",
                  password_label: "Senha",
                  button_label: "Entrar",
                  link_text: "Já tenho uma conta",
                  loading_button_label: "Entrando...",
                  email_input_placeholder: "seu@email.com",
                  password_input_placeholder: "Sua senha"
                },
                forgotten_password: {
                  link_text: 'Esqueceu a senha?',
                  email_label: 'Email',
                  email_input_placeholder: "seu@email.com",
                  button_label: 'Enviar',
                  loading_button_label: "Enviando..."
                },
              },
            }}
            view="sign_in"
            showLinks={true}
          />
        </div>
      </div>
    </motion.div>
  );
};