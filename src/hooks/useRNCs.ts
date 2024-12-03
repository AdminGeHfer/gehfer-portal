import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RNCFormData, DepartmentEnum } from "@/types/rnc";
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
          contact:rnc_contacts(*),
          events:rnc_events(*)
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

      // First create the RNC
      const { data: rnc, error: rncError } = await supabase
        .from("rncs")
        .insert({
          description: data.description,
          workflow_status: "open",
          priority: data.priority,
          type: data.type,
          department: data.department,
          company: data.company,
          cnpj: data.cnpj,
          order_number: data.orderNumber,
          return_number: data.returnNumber,
          created_by: user.user.id,
        })
        .select()
        .single();

      if (rncError) throw rncError;

      // Then create the contact
      const { error: contactError } = await supabase
        .from("rnc_contacts")
        .insert({
          rnc_id: rnc.id,
          name: data.contact.name,
          phone: data.contact.phone,
          email: data.contact.email,
        });

      if (contactError) throw contactError;

      // Finally create the initial event
      const { error: eventError } = await supabase
        .from("rnc_events")
        .insert({
          rnc_id: rnc.id,
          title: "RNC Criada",
          description: "RNC foi registrada no sistema",
          type: "creation",
          created_by: user.user.id,
        });

      if (eventError) throw eventError;

      return rnc.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rncs"] });
      toast.success("RNC criada com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Error creating RNC:", error);
      toast.error("Erro ao criar RNC: " + error.message);
    },
  });

  return {
    rncs,
    isLoading,
    createRNC,
  };
};