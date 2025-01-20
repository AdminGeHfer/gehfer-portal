import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RNCFormData } from "@/types/rnc";
import { toast } from "sonner";

export const useRNCs = () => {
  const queryClient = useQueryClient();

  const { data: rncs, isLoading } = useQuery({
    queryKey: ["rncs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rncs")
        .select(`
          *,
          products:rnc_products(*),
          contact:rnc_contacts(*),
          events:rnc_events(*),
          products:rnc_products(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createRNC = useMutation({
    mutationFn: async (data: RNCFormData) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Usuário não autenticado");

      // Create RNC with default status
      const { data: rnc, error: rncError } = await supabase
        .from("rncs")
        .insert({
          company_code: data.company_code,
          company: data.company,
          cnpj: data.cnpj,
          type: data.type,
          description: data.description,
          korp: data.korp,
          nfd: data.nfd,
          nfv: data.nfv,
          department: data.department,
          conclusion: data.conclusion,
          workflow_status: "open",
          status: "not_created", // Set default status
          created_by: user.user.id,
        })
        .select()
        .single();

      if (rncError) {
        console.error('Error creating RNC:', rncError);
        throw rncError;
      }

      // Create products if provided
      if (data.products && data.products.length > 0) {
        const { error: productsError } = await supabase
          .from("rnc_products")
          .insert(
            data.products.map(product => ({
              rnc_id: rnc.id,
              product: product.product,
              weight: product.weight
            }))
          );

        if (productsError) {
          console.error('Error creating products:', productsError);
          throw productsError;
        }
      }

      // Create contact
      if (data.contact) {
        const { error: contactError } = await supabase
          .from("rnc_contacts")
          .insert({
            rnc_id: rnc.id,
            name: data.contact.name,
            phone: data.contact.phone,
            email: data.contact.email,
          });

        if (contactError) {
          console.error('Error creating contact:', contactError);
          throw contactError;
        }
      }

      // Create initial event
      const { error: eventError } = await supabase
        .from("rnc_events")
        .insert({
          rnc_id: rnc.id,
          title: "RNC Criada",
          description: "RNC foi registrada no sistema",
          type: "creation",
          created_by: user.user.id,
        });

      if (eventError) {
        console.error('Error creating event:', eventError);
        throw eventError;
      }

      return rnc;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rncs"] });
      toast.success("RNC criada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar RNC:", error);
      toast.error(`Erro ao criar RNC: ${error.message}`);
    },
  });

  return {
    rncs,
    isLoading,
    createRNC,
  };
};