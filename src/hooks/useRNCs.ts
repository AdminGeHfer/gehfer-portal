import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RNC, WorkflowStatusEnum } from "@/types/rnc";

export const useRNCs = () => {
  const { data: rncs = [], isLoading } = useQuery({
    queryKey: ["rncs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rncs")
        .select(`
          *,
          contacts:rnc_contacts(*),
          events:rnc_events(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const getDashboardStats = () => {
    const total = rncs.length;
    const open = rncs.filter(rnc => rnc.workflow_status === WorkflowStatusEnum.OPEN).length;
    const inProgress = rncs.filter(rnc => [WorkflowStatusEnum.ANALYSIS, WorkflowStatusEnum.RESOLUTION].includes(rnc.workflow_status as WorkflowStatusEnum)).length;
    const closed = rncs.filter(rnc => rnc.workflow_status === WorkflowStatusEnum.CLOSED).length;

    // Calculate average resolution time in days
    const resolvedRncs = rncs.filter(rnc => rnc.closed_at);
    const averageResolutionTime = resolvedRncs.length > 0
      ? Math.round(
          resolvedRncs.reduce((acc, rnc) => {
            const start = new Date(rnc.created_at);
            const end = new Date(rnc.closed_at!);
            return acc + (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
          }, 0) / resolvedRncs.length
        )
      : 0;

    return {
      total,
      open,
      inProgress,
      closed,
      averageResolutionTime
    };
  };

  const createRNC = async (data: Partial<RNC>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    
    if (!userId) throw new Error("User not authenticated");

    const rncData = {
      description: data.description,
      priority: data.priority,
      type: data.type,
      department: data.department,
      company: data.company,
      cnpj: data.cnpj,
      order_number: data.orderNumber,
      return_number: data.returnNumber,
      workflow_status: WorkflowStatusEnum.OPEN,
      created_by: userId
    } as const;

    const { data: newRNC, error } = await supabase
      .from("rncs")
      .insert([rncData])
      .select()
      .single();

    if (error) throw error;

    if (data.contact && newRNC) {
      const { error: contactError } = await supabase
        .from("rnc_contacts")
        .insert([{
          rnc_id: newRNC.id,
          name: data.contact.name,
          phone: data.contact.phone,
          email: data.contact.email
        }]);

      if (contactError) throw contactError;
    }

    return newRNC;
  };

  return {
    rncs,
    isLoading,
    createRNC,
    getDashboardStats
  };
};