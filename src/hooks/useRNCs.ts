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
          contact:rnc_contacts(*),
          events:rnc_events(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getDashboardStats = () => {
    if (!rncs) return {
      total: 0,
      open: 0,
      inProgress: 0,
      closed: 0,
      averageResolutionTime: 0
    };

    const total = rncs.length;
    const open = rncs.filter(rnc => rnc.workflow_status === 'open').length;
    const inProgress = rncs.filter(rnc => ['analysis', 'resolution'].includes(rnc.workflow_status)).length;
    const closed = rncs.filter(rnc => rnc.workflow_status === 'closed').length;

    const closedRncs = rncs.filter(rnc => rnc.closed_at);
    const totalResolutionTime = closedRncs.reduce((acc, rnc) => {
      const start = new Date(rnc.created_at);
      const end = new Date(rnc.closed_at!);
      return acc + (end.getTime() - start.getTime());
    }, 0);

    const averageResolutionTime = closedRncs.length > 0 
      ? Math.round(totalResolutionTime / closedRncs.length / (1000 * 60 * 60 * 24)) 
      : 0;

    return {
      total,
      open,
      inProgress,
      closed,
      averageResolutionTime
    };
  };

  const createRNC = useMutation({
    mutationFn: async (data: RNCFormData) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Usuário não autenticado");

      // First, create the RNC
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
          order_number: data.order_number,
          return_number: data.return_number,
          created_by: user.user.id,
        })
        .select()
        .single();

      if (rncError) {
        console.error('Error creating RNC:', rncError);
        throw rncError;
      }

      // Then, create the contact
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

      // Finally, create the initial event
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
    getDashboardStats
  };
};
