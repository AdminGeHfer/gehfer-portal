import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    if (accessToken && refreshToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
    } else {
      console.log("Tokens não encontrados na URL");
      toast.error("Link de reset de senha inválido ou expirado");
      navigate("/login");
    }
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;
      toast.success("Senha atualizada com sucesso!");
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao resetar senha:", error);
      toast.error(error.message || "Erro ao atualizar senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-[#112240] dark:via-[#0A192F] dark:to-[#233554]" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 backdrop-blur-sm bg-white/50 dark:bg-background/50 z-50"
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
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-300 to-gray-100 dark:from-[#233554] dark:to-[#112240] shadow-lg"
              >
                <span className="text-3xl font-bold text-gray-700 dark:text-primary-foreground">G</span>
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
                Digite sua nova senha abaixo
              </motion.span>
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Input
                type="password"
                placeholder="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="font-sans backdrop-blur-sm bg-white/50 dark:bg-background/50 border-gray-200/50 dark:border-border/50 focus:border-gray-400 dark:focus:border-[#233554] transition-all duration-300"
              />
              <Input
                type="password"
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="font-sans backdrop-blur-sm bg-white/50 dark:bg-background/50 border-gray-200/50 dark:border-border/50 focus:border-gray-400 dark:focus:border-[#233554] transition-all duration-300"
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full font-sans bg-gradient-to-r from-gray-600 to-gray-700 dark:from-[#233554] dark:to-[#112240] hover:from-gray-700 hover:to-gray-800 dark:hover:from-[#112240] dark:hover:to-[#233554] text-white dark:text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {loading ? "Atualizando..." : "Atualizar Senha"}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;