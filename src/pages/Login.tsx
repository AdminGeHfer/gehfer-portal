import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoginContainer } from "@/features/auth/components/LoginContainer";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/apps");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return <LoginContainer />;
};

export default Login;