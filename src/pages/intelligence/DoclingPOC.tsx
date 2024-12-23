import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DoclingPOCUI } from "@/components/intelligence/docling/DoclingPOCUI";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DoclingPOC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (!session) {
          toast.error("Please login to access this page");
          navigate("/login");
          return;
        }
      } catch (error: any) {
        console.error("Auth error:", error);
        toast.error("Authentication error. Please try logging in again.");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="container mx-auto py-8">
      <DoclingPOCUI />
    </div>
  );
};

export default DoclingPOC;