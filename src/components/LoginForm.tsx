import * as React from 'react';
import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const LoginForm = (): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    console.log('Login attempt started with email:', email);
    
    if (email && password) {
      try {
        console.log('Attempting to sign in with Supabase...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          console.error('Supabase login error:', error);
          toast({
            variant: "destructive",
            title: "Erro ao fazer login",
            description: error.message,
          });
          return;
        }

        console.log('Login successful:', data);
        
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          console.log('User profile:', profile);
        }

        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao sistema The Four",
        });
        navigate('/app');
      } catch (error) {
        console.error('Unexpected error during login:', error);
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: "Ocorreu um erro inesperado",
        });
      }
    } else {
      console.log('Login validation failed - missing email or password');
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Por favor, preencha todos os campos",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-primary" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-primary transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-primary" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 pl-10 pr-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-primary transition-all"
            />
            <button
              type="button"
              data-testid="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-primary hover:text-primary/80 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Button 
            type="submit" 
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25"
          >
            Entrar
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default LoginForm;